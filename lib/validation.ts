import { z } from "zod";

export const serviceValues = [
  "online",
  "growth",
  "clinic",
  "parenting",
] as const;

export const serviceLabels: Record<(typeof serviceValues)[number], string> = {
  online: "Online Video Consultation",
  growth: "Behavioral & Growth Guidance",
  clinic: "In-Clinic Visit",
  parenting: "Parenting Session",
};

export const bookingSchema = z.object({
  service: z.enum(serviceValues, {
    message: "Please select a consultation type.",
  }),
  date: z
    .string()
    .min(1, "Please choose a date.")
    .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00`)), {
      message: "Please choose a valid date.",
    }),
  time: z.string().min(1, "Please choose an available time."),
  parentName: z.string().trim().min(2, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number.")
    .max(24, "Please enter a valid phone number."),
  childAge: z.string().trim().min(1, "Please tell us your child’s age."),
  notes: z.string().trim().max(800, "Please keep notes under 800 characters."),
  consent: z.boolean().refine(Boolean, {
    message: "Please agree so we can contact you about this appointment.",
  }),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  message: z.string().trim().min(10).max(1000),
});

export type ContactInput = z.infer<typeof contactSchema>;
