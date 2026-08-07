"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  Check,
  Clock3,
  LoaderCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  bookingSchema,
  type BookingInput,
  serviceLabels,
  serviceValues,
} from "@/lib/validation";

const slots = [
  "10:00 AM",
  "10:45 AM",
  "11:30 AM",
  "12:15 PM",
  "3:00 PM",
  "3:45 PM",
  "4:30 PM",
  "5:15 PM",
  "6:00 PM",
];

function dateInputValue(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().split("T")[0];
}

export default function BookingEngine() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: undefined,
      date: "",
      time: "",
      parentName: "",
      email: "",
      phone: "",
      childAge: "",
      notes: "",
      consent: false,
    },
  });

  const selectedService = watch("service");
  const selectedDate = watch("date");
  const selectedTime = watch("time");

  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    const maximum = new Date(today);
    maximum.setDate(maximum.getDate() + 90);
    return { minDate: dateInputValue(today), maxDate: dateInputValue(maximum) };
  }, []);

  const isUnavailable = (slot: string, index: number) => {
    if (!selectedDate) return true;
    const day = new Date(`${selectedDate}T12:00:00`).getDay();
    if (day === 0) return true;
    if (day === 6 && index > 5) return true;
    if (selectedService === "online" && slot === "12:15 PM") return true;
    return [1, 6].includes(index);
  };

  const onSubmit = async (data: BookingInput) => {
    setStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "We couldn’t send the request.");
      }

      setStatus("success");
      setStatusMessage(
        result.message ?? "Your request is on its way. We’ll confirm it shortly.",
      );
      reset();
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "We couldn’t send the request. Please try WhatsApp instead.",
      );
    }
  };

  return (
    <section className="section section-cream booking-section" id="book">
      <div className="section-inner reveal-section">
        <div className="booking-heading">
          <div>
            <p className="eyebrow">Book an appointment</p>
            <h2>Choose a time that works for your family.</h2>
          </div>
          <div className="booking-reassurance">
            <Sparkles size={21} aria-hidden="true" />
            <p>
              <strong>No payment needed now.</strong>
              We’ll confirm your appointment before you visit.
            </p>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-step">
            <div className="step-heading">
              <span>1</span>
              <div>
                <h3>What kind of support do you need?</h3>
                <p>Select one consultation type.</p>
              </div>
            </div>
            <input type="hidden" {...register("service")} />
            <div className="service-choice-grid">
              {serviceValues.map((service) => (
                <button
                  className={`choice-button ${selectedService === service ? "is-selected" : ""}`}
                  key={service}
                  type="button"
                  aria-pressed={selectedService === service}
                  onClick={() => {
                    setValue("service", service, { shouldValidate: true });
                    setValue("time", "");
                  }}
                >
                  <span>{serviceLabels[service]}</span>
                  <Check size={17} aria-hidden="true" />
                </button>
              ))}
            </div>
            {errors.service && <p className="field-error">{errors.service.message}</p>}
          </div>

          <div className={`form-step ${!selectedService ? "is-locked" : ""}`}>
            <div className="step-heading">
              <span>2</span>
              <div>
                <h3>Pick a day</h3>
                <p>Appointments are available Monday through Saturday.</p>
              </div>
            </div>
            <label className="date-field">
              <CalendarDays size={20} aria-hidden="true" />
              <span>Preferred date</span>
              <input
                type="date"
                min={minDate}
                max={maxDate}
                disabled={!selectedService}
                {...register("date", {
                  onChange: () => setValue("time", ""),
                })}
              />
            </label>
            {errors.date && <p className="field-error">{errors.date.message}</p>}
          </div>

          <div className={`form-step ${!selectedDate ? "is-locked" : ""}`}>
            <div className="step-heading">
              <span>3</span>
              <div>
                <h3>Choose an available time</h3>
                <p>Times shown are in Pakistan Standard Time.</p>
              </div>
            </div>
            <input type="hidden" {...register("time")} />
            <div className="slot-grid" aria-label="Available appointment times">
              {slots.map((slot, index) => {
                const disabled = isUnavailable(slot, index);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={disabled}
                    className={selectedTime === slot ? "is-selected" : ""}
                    aria-pressed={selectedTime === slot}
                    onClick={() => setValue("time", slot, { shouldValidate: true })}
                  >
                    <Clock3 size={15} aria-hidden="true" />
                    {slot}
                  </button>
                );
              })}
            </div>
            {selectedDate && slots.every((slot, index) => isUnavailable(slot, index)) && (
              <p className="field-note">The clinic is closed on Sundays. Please choose another day.</p>
            )}
            {errors.time && <p className="field-error">{errors.time.message}</p>}
          </div>

          <fieldset className="form-step details-step">
            <legend className="step-heading">
              <span>4</span>
              <span>
                <strong>Your details</strong>
                <small>You can fill this in while choosing your appointment.</small>
              </span>
            </legend>
            <div className="details-grid">
              <label>
                Parent or guardian name
                <input placeholder="Your full name" autoComplete="name" {...register("parentName")} />
                {errors.parentName && <small className="field-error">{errors.parentName.message}</small>}
              </label>
              <label>
                Email address
                <input type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
                {errors.email && <small className="field-error">{errors.email.message}</small>}
              </label>
              <label>
                Phone number
                <input type="tel" placeholder="+92 300 123 4567" autoComplete="tel" {...register("phone")} />
                {errors.phone && <small className="field-error">{errors.phone.message}</small>}
              </label>
              <label>
                Child’s age
                <input placeholder="e.g. 18 months" {...register("childAge")} />
                {errors.childAge && <small className="field-error">{errors.childAge.message}</small>}
              </label>
              <label className="full-field">
                Anything you’d like the doctor to know? <span>(optional)</span>
                <textarea rows={4} placeholder="A short note about your concern" {...register("notes")} />
                {errors.notes && <small className="field-error">{errors.notes.message}</small>}
              </label>
            </div>

            <label className="consent-field">
              <input type="checkbox" {...register("consent")} />
              <span>
                I agree that BrightNest may contact me about this appointment request.
              </span>
            </label>
            {errors.consent && <p className="field-error">{errors.consent.message}</p>}

            <button className="button button-primary submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="spin-icon" size={19} aria-hidden="true" />
                  Sending request…
                </>
              ) : (
                <>
                  <Send size={18} aria-hidden="true" />
                  Request appointment
                </>
              )}
            </button>

            {status !== "idle" && (
              <div className={`form-status ${status}`} role="status">
                {status === "success" && <Check size={20} aria-hidden="true" />}
                <p>{statusMessage}</p>
              </div>
            )}
          </fieldset>
        </form>
      </div>
    </section>
  );
}
