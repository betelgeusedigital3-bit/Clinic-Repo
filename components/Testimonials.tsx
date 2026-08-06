"use client";

import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const reviews = [
  {
    name: "Maham R.",
    relation: "Mother of a 3-year-old",
    quote:
      "Dr. Zara listened without rushing us and explained every step in plain language. We left calmer, with a plan we could actually follow.",
  },
  {
    name: "Ali & Sana",
    relation: "Parents of twins",
    quote:
      "The video consultation felt remarkably personal. She noticed the little details and followed up after the appointment, which meant so much.",
  },
  {
    name: "Hira K.",
    relation: "Mother of a 7-month-old",
    quote:
      "Feeding had become stressful for all of us. The advice was gentle, realistic, and never judgmental. Our home feels lighter now.",
  },
  {
    name: "Usman A.",
    relation: "Father of a 6-year-old",
    quote:
      "Our son usually fears clinics, but here he felt included instead of talked over. He still remembers the sunny room and Dr. Zara’s kindness.",
  },
  {
    name: "Ayesha N.",
    relation: "Mother of a toddler",
    quote:
      "I came in with a long list of worries. I left with clear priorities, simple next steps, and the feeling that someone truly understood us.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const reduced = useRef(false);

  const goTo = (next: number) => {
    setActive((next + reviews.length) % reviews.length);
  };

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % reviews.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, [paused]);

  useLayoutEffect(() => {
    if (!track.current) return;
    gsap.to(track.current, {
      xPercent: -active * 100,
      duration: reduced.current ? 0 : 0.65,
      ease: "power3.inOut",
      overwrite: true,
    });
  }, [active]);

  return (
    <section className="section section-peach testimonials-section" id="reviews">
      <div className="section-inner reveal-section">
        <div className="section-heading testimonial-heading">
          <div>
            <p className="eyebrow">Kind words from parents</p>
            <h2>Care that families feel.</h2>
          </div>
          <div className="review-score" aria-label="Five out of five stars">
            <span>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={17} fill="currentColor" aria-hidden="true" />
              ))}
            </span>
            <strong>5.0 average parent rating</strong>
          </div>
        </div>

        <div
          className="testimonial-window"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={(event) => {
            pointerStart.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return;
            const distance = event.clientX - pointerStart.current;
            if (Math.abs(distance) > 45) goTo(active + (distance < 0 ? 1 : -1));
            pointerStart.current = null;
          }}
        >
          <div className="testimonial-track" ref={track} aria-live="polite">
            {reviews.map((review, index) => (
              <article className="testimonial-card" key={review.name} aria-hidden={index !== active}>
                <Quote className="quote-icon" size={34} aria-hidden="true" />
                <blockquote>“{review.quote}”</blockquote>
                <footer>
                  <span className="review-avatar" aria-hidden="true">
                    {review.name.charAt(0)}
                  </span>
                  <span>
                    <strong>{review.name}</strong>
                    <small>{review.relation}</small>
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <div className="testimonial-controls">
          <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous review">
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
          <div className="testimonial-dots" aria-label={`Review ${active + 1} of ${reviews.length}`}>
            {reviews.map((review, index) => (
              <button
                key={review.name}
                type="button"
                className={active === index ? "is-active" : ""}
                onClick={() => goTo(index)}
                aria-label={`Show review ${index + 1}`}
                aria-current={active === index ? "true" : undefined}
              />
            ))}
          </div>
          <button type="button" onClick={() => goTo(active + 1)} aria-label="Next review">
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
