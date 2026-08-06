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

    const [clinicResult, parentResult] = await Promise.all([
      resend.emails.send({
        from: senderAddress,
        to: clinicInbox,
        replyTo: data.email,
        subject: `New booking: ${service} — ${data.date} at ${data.time}`,
        html: `
          <h1>New BrightNest appointment request</h1>
          <p><strong>Service:</strong> ${escapeHtml(service)}</p>
          <p><strong>Date:</strong> ${safe.date}</p>
          <p><strong>Time:</strong> ${safe.time}</p>
          <p><strong>Parent:</strong> ${safe.parentName}</p>
          <p><strong>Email:</strong> ${safe.email}</p>
          <p><strong>Phone:</strong> ${safe.phone}</p>
          <p><strong>Child’s age:</strong> ${safe.childAge}</p>
          <p><strong>Notes:</strong> ${safe.notes || "None provided"}</p>
        `,
      }),
      resend.emails.send({
        from: senderAddress,
        to: data.email,
        subject: "We received your BrightNest appointment request",
        html: `
          <h1>Thank you, ${safe.parentName}</h1>
          <p>We’ve received your request for a <strong>${escapeHtml(service)}</strong> on <strong>${safe.date}</strong> at <strong>${safe.time}</strong>.</p>
          <p>Our care coordinator will confirm the appointment by phone or email shortly.</p>
          <p>If your child needs urgent medical care, please contact your local emergency service.</p>
        `,
      }),
    ]);

    if (clinicResult.error || parentResult.error) {
      throw new Error("Resend could not deliver one or more booking emails.");
    }

    return NextResponse.json({
      message: "Your appointment request is on its way. We’ll confirm it shortly.",
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
