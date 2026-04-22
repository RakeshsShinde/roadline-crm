import { z } from "zod";

export const sendOtpSchema = z.object({
  identifier: z
    .string()
    .min(3, "Identifier required")
    .refine(
      (val) =>
        /^[0-9]{10}$/.test(val) || // phone
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), // email
      {
        message: "Must be valid email or phone number",
      },
    ),

  type: z.enum(["signup", "login", "forgot_password", "verify_phone"]),
});

export const verifyOtpSchema = z.object({
  identifier: z.string().min(3),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^[0-9]+$/, "OTP must be numeric"),

  type: z.enum(["signup", "login", "forgot_password", "verify_phone"]),

  requestId: z.string().uuid().optional(),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
