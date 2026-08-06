import { MessageCircleMore } from "lucide-react";

export default function WhatsAppFloatingButton() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/923001234567?text=Hello%20BrightNest%2C%20I%27d%20like%20to%20ask%20about%20a%20consultation."
      target="_blank"
      rel="noreferrer"
      aria-label="Ask BrightNest on WhatsApp"
    >
      <MessageCircleMore aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
}
