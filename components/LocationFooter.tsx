"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  Send,
} from "lucide-react";
import { type FormEvent, useState } from "react";

const hours = [
  ["Monday – Thursday", "10:00 AM – 7:00 PM"],
  ["Friday", "3:00 PM – 7:00 PM"],
  ["Saturday", "10:00 AM – 4:00 PM"],
  ["Sunday", "Closed"],
];

export default function LocationFooter() {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setMessage("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { message?: string };
      setMessage(result.message ?? "Thanks — we’ll reply soon.");
      if (response.ok) form.reset();
    } catch {
      setMessage("We couldn’t send that just now. Please use WhatsApp instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="site-footer section" id="contact">
      <div className="section-inner reveal-section">
        <div className="footer-heading">
          <p className="eyebrow">Plan your visit</p>
          <h2>A calm little corner for growing families.</h2>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Gulberg+III+Lahore"
            target="_blank"
            rel="noreferrer"
          >
            Get directions <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>

        <div className="location-grid">
          <div className="map-card">
            <iframe
              title="Map to BrightNest Pediatric Clinic in Gulberg III, Lahore"
              src="https://www.google.com/maps?q=Gulberg%20III%2C%20Lahore%2C%20Pakistan&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="map-address">
              <MapPin size={23} aria-hidden="true" />
              <p>
                <strong>BrightNest Pediatric Clinic</strong>
                12-C Garden Avenue, Gulberg III, Lahore
              </p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-heading">
              <Clock3 size={22} aria-hidden="true" />
              <h3>Clinic hours</h3>
            </div>
            <dl className="hours-list">
              {hours.map(([day, time]) => (
                <div key={day}>
                  <dt>{day}</dt>
                  <dd>{time}</dd>
                </div>
              ))}
            </dl>

            <div className="contact-links">
              <a href="tel:+923001234567">
                <Phone size={18} aria-hidden="true" /> +92 300 123 4567
              </a>
              <a href="mailto:hello@brightnestclinic.com">
                <Mail size={18} aria-hidden="true" /> hello@brightnestclinic.com
              </a>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircleMore size={18} aria-hidden="true" /> WhatsApp the care team
              </a>
            </div>
          </div>

          <form className="inquiry-card" onSubmit={submitInquiry}>
            <p className="eyebrow">Have a quick question?</p>
            <h3>Send us a note.</h3>
            <label>
              Your name
              <input name="name" autoComplete="name" required minLength={2} />
            </label>
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Your question
              <textarea name="message" rows={3} required minLength={10} />
            </label>
            <button className="button button-primary" type="submit" disabled={sending}>
              {sending ? (
                <LoaderCircle className="spin-icon" size={18} aria-hidden="true" />
              ) : (
                <Send size={17} aria-hidden="true" />
              )}
              {sending ? "Sending…" : "Send question"}
            </button>
            {message && <p className="inquiry-status" role="status">{message}</p>}
          </form>
        </div>

        <div className="footer-bottom">
          <a className="footer-brand" href="#top">
            <span className="footer-logo-mark" aria-hidden="true">
              <Image
                className="footer-logo"
                src="/brightnest-logo.png"
                alt=""
                width={612}
                height={408}
              />
            </span>
            <span>BrightNest <small>Pediatric Clinic</small></span>
          </a>
          <p>© {new Date().getFullYear()} BrightNest. Care made gentler.</p>
          <p className="emergency-note">For emergencies, contact your nearest emergency service.</p>
        </div>
      </div>
    </footer>
  );
}
