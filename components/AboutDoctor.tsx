import { Award, BadgeCheck, BookOpenCheck, Stethoscope } from "lucide-react";

const credentials = [
  "MBBS · King Edward Medical University",
  "FCPS · Paediatrics",
  "Certified in Child Development & Behavior",
];

const counters = [
  { number: 10, suffix: "+", label: "Years of experience" },
  { number: 4500, suffix: "+", label: "Little patients cared for" },
  { number: 98, suffix: "%", label: "Parents who recommend us" },
];

export default function AboutDoctor() {
  return (
    <section className="section section-cream" id="about">
      <div className="section-inner about-grid reveal-section">
        <div className="doctor-portrait" role="img" aria-label="Portrait placeholder for Dr. Zara Ahmed">
          <div className="portrait-sun" />
          <div className="portrait-arch">
            <span className="portrait-face" />
            <span className="portrait-body" />
            <span className="portrait-stethoscope">
              <Stethoscope size={40} strokeWidth={1.7} />
            </span>
          </div>
          <div className="portrait-badge">
            <BadgeCheck size={19} aria-hidden="true" />
            <span>
              PMC registered
              <strong>Consultant pediatrician</strong>
            </span>
          </div>
        </div>

        <div className="about-copy">
          <p className="eyebrow">Meet your pediatrician</p>
          <h2>Expert guidance, delivered with warmth.</h2>
          <p className="about-lead">
            Dr. Zara Ahmed brings evidence, empathy, and a calm listening ear to
            every consultation. Her approach looks beyond symptoms to support
            the whole child — and the family around them.
          </p>
          <ul className="credential-list">
            {credentials.map((credential, index) => (
              <li key={credential}>
                {index === 0 ? <BookOpenCheck /> : index === 1 ? <Award /> : <BadgeCheck />}
                <span>{credential}</span>
              </li>
            ))}
          </ul>
          <blockquote>
            “Questions are always welcome here. Informed parents help children
            thrive.”
          </blockquote>
        </div>

        <div className="counter-row" aria-label="Clinic highlights">
          {counters.map((counter) => (
            <div className="counter-card" key={counter.label}>
              <strong>
                <span data-counter={counter.number}>{counter.number}</span>
                {counter.suffix}
              </strong>
              <span>{counter.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
