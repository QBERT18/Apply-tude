import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Must be a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.email("Must be a valid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export type AuthFieldErrors = Partial<
  Record<keyof LoginInput | keyof SignupInput | "form", string[]>
>;
