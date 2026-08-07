import { NextResponse } from "next/server";
import {
  clinicInbox,
  escapeHtml,
  getResendClient,
  senderAddress,
} from "@/lib/resend";
import { contactSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please complete all three fields." },
        { status: 400 },
      );
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        { message: "Please send your question through WhatsApp for now." },
        { status: 503 },
      );
    }

    const { name, email, message } = parsed.data;
    const clinicResult = await resend.emails.send({
      from: senderAddress,
      to: clinicInbox,
      replyTo: email,
      subject: `Website inquiry from ${name}`,
      html: `
        <h1>New website inquiry</h1>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Question:</strong></p>
        <p>${escapeHtml(message)}</p>
      `,
    });

    if (clinicResult.error) {
      throw new Error("Resend could not deliver the inquiry email to the clinic.");
    }

    return NextResponse.json({
      message: "Thanks — your question has been sent. We’ll reply soon.",
    });
  } catch (error) {
    console.error("Contact request failed", error);
    return NextResponse.json(
      { message: "We couldn’t send that just now. Please use WhatsApp instead." },
      { status: 500 },
    );
  }
}
