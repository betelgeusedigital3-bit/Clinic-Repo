"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutDoctor from "./AboutDoctor";
import Header from "./Header";
import Hero from "./Hero";
import WhatsAppFloatingButton from "./WhatsAppFloatingButton";

const Services = dynamic(() => import("./Services"), {
  loading: () => <SectionLoading label="Preparing consultation options" />,
});

const BookingEngine = dynamic(() => import("./BookingEngine"), {
  loading: () => <SectionLoading label="Preparing the booking calendar" />,
});

const Testimonials = dynamic(() => import("./Testimonials"), {
  loading: () => <SectionLoading label="Gathering parent stories" />,
});

const LocationFooter = dynamic(() => import("./LocationFooter"), {
  loading: () => <SectionLoading label="Loading clinic details" />,
});

function SectionLoading({ label }: { label: string }) {
  return (
    <div className="section-loading" role="status" aria-label={label}>
      <span />
      <span />
      <span />
    </div>
  );
}

export default function ClinicPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(".reveal-section, .service-card", { opacity: 1, y: 0 });
      return;
    }

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 34,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        });
      });

      gsap.from(".service-card", {
        opacity: 0,
        y: 28,
        duration: 0.65,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#services",
          start: "top 80%",
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((counter) => {
        const target = Number(counter.dataset.counter ?? 0);
        const value = { current: 0 };
        gsap.to(value, {
          current: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            counter.textContent = Math.round(value.current).toString();
          },
        });
      });
    });

    return () => context.revert();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <AboutDoctor />
        <Services />
        <BookingEngine />
        <Testimonials />
      </main>
      <LocationFooter />
      <WhatsAppFloatingButton />
    </>
  );
}
