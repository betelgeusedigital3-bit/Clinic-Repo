import { NextResponse } from "next/server";
import {
  clinicInbox,
  escapeHtml,
  getResendClient,
  senderAddress,
} from "@/lib/resend";
import { bookingSchema, serviceLabels } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    const parsed = bookingSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please review the highlighted booking details." },
        { status: 400 },
      );
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        {
          message:
            "Online booking email is being connected. Please use WhatsApp or call the clinic for now.",
        },
        { status: 503 },
      );
    }

    const data = parsed.data;
    const service = serviceLabels[data.service];
    const safe = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        escapeHtml(String(value)),
      ]),
    );

    const clinicResult = await resend.emails.send({
      from: senderAddress,
      to: clinicInbox,
      replyTo: data.email,
      subject: `New booking: ${service} — ${data.date} at ${data.time}`,
      html: `
        <h1>New BrightNest appointment request</h1>
        <p><strong>Status:</strong> Pending approval</p>
        <p><strong>Service:</strong> ${escapeHtml(service)}</p>
        <p><strong>Date:</strong> ${safe.date}</p>
        <p><strong>Time:</strong> ${safe.time}</p>
        <p><strong>Parent:</strong> ${safe.parentName}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Phone:</strong> ${safe.phone}</p>
        <p><strong>Child’s age:</strong> ${safe.childAge}</p>
        <p><strong>Notes:</strong> ${safe.notes || "None provided"}</p>
      `,
    });

    if (clinicResult.error) {
      throw new Error("Resend could not deliver the booking email to the clinic.");
    }

    return NextResponse.json({
      message:
        "Your appointment has been requested. We will let you know whether it is approved.",
    });
  } catch (error) {
    console.error("Booking request failed", error);
    return NextResponse.json(
      {
        message:
          "We couldn’t send the request just now. Please try again or use WhatsApp.",
      },
      { status: 500 },
    );
  }
}
