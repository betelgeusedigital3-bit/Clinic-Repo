"use client";

import Image from "next/image";
import { Phone } from "lucide-react";

const links = [
  ["About", "#about"],
  ["Services", "#services"],
  ["Book", "#book"],
  ["Reviews", "#reviews"],
  ["Visit", "#contact"],
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <a className="brand" href="#top" aria-label="BrightNest home">
          <span className="brand-mark" aria-hidden="true">
            <Image
              className="brand-logo"
              src="/brightnest-logo.png"
              alt=""
              width={612}
              height={408}
              priority
            />
          </span>
          <span>
            BrightNest
            <small>Pediatric Clinic</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <a className="nav-call" href="tel:+923001234567">
          <Phone size={17} aria-hidden="true" />
          <span>Call clinic</span>
        </a>
      </div>

      <nav className="mobile-nav" aria-label="Section navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
