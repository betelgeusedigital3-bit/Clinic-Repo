"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { ArrowRight, CalendarCheck, MessageCircleMore } from "lucide-react";
import { gsap } from "gsap";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .from(".hero-eyebrow", { opacity: 0, y: 18, duration: 0.55 })
        .from(".hero-title", { opacity: 0, y: 28, duration: 0.8 }, "-=0.25")
        .from(".hero-copy", { opacity: 0, y: 20, duration: 0.65 }, "-=0.42")
        .from(
          ".hero-actions > *",
          { opacity: 0, y: 16, duration: 0.5, stagger: 0.12 },
          "-=0.32",
        )
        .from(".hero-note", { opacity: 0, y: 12, duration: 0.45 }, "-=0.22");
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-bloom hero-bloom-one" />
      <div className="hero-bloom hero-bloom-two" />
      <div className="hero-inner">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">
            <span aria-hidden="true">●</span> Child-led care, parent-supported
          </p>
          <h1 className="hero-title">
            Gentle care for every <em>little milestone.</em>
          </h1>
          <p className="hero-copy">
            Evidence-led pediatric consultations with Dr. Zara Ahmed — warm,
            unhurried support for babies, children, and the people raising them.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#book">
              <CalendarCheck size={19} aria-hidden="true" />
              Book consultation
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a
              className="button button-secondary"
              href="https://wa.me/923001234567?text=Hello%20BrightNest%2C%20I%27d%20like%20to%20ask%20about%20a%20consultation."
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircleMore size={19} aria-hidden="true" />
              WhatsApp inquiry
            </a>
          </div>
          <p className="hero-note">
            <span aria-hidden="true">✓</span> Same-week appointments available
          </p>
        </div>

        <div className="hero-visual">
          <Image
            className="hero-image"
            src="/mother-and-baby-hero.png"
            alt="A smiling mother holding her happy baby"
            fill
            priority
            sizes="(min-width: 1040px) 540px, (min-width: 760px) 45vw, calc(100vw - 2rem)"
          />
        </div>
      </div>
    </section>
  );
}
