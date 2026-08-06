import { Baby, Brain, Hospital, Video } from "lucide-react";

const services = [
  {
    icon: Video,
    number: "01",
    title: "Online Video Consultation",
    description:
      "Thoughtful pediatric advice from home for follow-ups, common concerns, and parent reassurance.",
    tag: "30 minutes",
  },
  {
    icon: Brain,
    number: "02",
    title: "Behavioral & Growth Guidance",
    description:
      "Clear, age-appropriate support for development, sleep, feeding, growth, and behavior.",
    tag: "45 minutes",
  },
  {
    icon: Hospital,
    number: "03",
    title: "In-Clinic Visits",
    description:
      "Unhurried physical assessments in a calm, child-friendly setting with room for every question.",
    tag: "30 minutes",
  },
  {
    icon: Baby,
    number: "04",
    title: "Parenting Sessions",
    description:
      "Practical, judgment-free coaching for routines, transitions, boundaries, and confident caregiving.",
    tag: "50 minutes",
  },
];

export default function Services() {
  return (
    <section className="section section-peach" id="services">
      <div className="section-inner reveal-section">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">How we can help</p>
            <h2>Support for today’s concern — and tomorrow’s growth.</h2>
          </div>
          <p>
            Choose the kind of support that fits your family. Not sure which is
            right? Send us a WhatsApp message and we’ll guide you.
          </p>
        </div>

        <div className="services-grid">
          {services.map(({ icon: Icon, number, title, description, tag }) => (
            <article className="service-card" key={title}>
              <div className="service-card-top">
                <span className="service-icon" aria-hidden="true">
                  <Icon size={26} strokeWidth={1.8} />
                </span>
                <span className="service-number">{number}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="service-tag">{tag}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
