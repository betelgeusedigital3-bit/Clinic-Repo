import { Resend } from "resend";

export function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export const clinicInbox =
  process.env.CLINIC_EMAIL ?? "appointments@brightnestclinic.com";

export const senderAddress =
  process.env.RESEND_FROM_EMAIL ?? "BrightNest Clinic <bookings@example.com>";

export function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        '"': "&quot;",
      })[character] ?? character,
  );
}
