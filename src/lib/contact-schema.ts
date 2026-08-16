import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "That name is too long")

    .regex(/^[^\r\n\t]+$/, "Please enter a valid name"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(160, "That email address is too long")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a phone number we can reach you on")
    .max(20, "That phone number is too long")
    .regex(/^[+()\d][\d\s\-()]{6,}$/, "Please enter a valid phone number"),
  projectType: z.enum(["residential", "commercial", "civil", "other"]),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little about the space — 10 characters minimum")
    .max(2000, "Please keep the message under 2000 characters"),
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const PROJECT_TYPES = [
  { value: "residential", label: "Home interiors" },
  { value: "commercial", label: "Office / retail fit-out" },
  { value: "civil", label: "Civil & construction" },
  { value: "other", label: "Something else" },
] as const;
