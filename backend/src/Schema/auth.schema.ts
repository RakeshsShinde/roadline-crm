import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(20),

  email: z.email("Invalid email address").max(150),

  password: z.string().min(6, "Password must be at least 6 characters"),

  avatar: z.url("Avatar must be a valid URL").optional(),
  auth_provider: z.enum(["local", "google", "github"]).optional(),

  default_currency: z.string().min(1).max(10).optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type RegisterUserInput = z.infer<typeof registerSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
