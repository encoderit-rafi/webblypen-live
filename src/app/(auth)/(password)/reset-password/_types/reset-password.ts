import { z } from "zod";

// Schema
export const ResetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password is too long"),
    password_confirmation: z.string(),
    token: z.string().nonempty("Token is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password_confirmation"],
        message: "Passwords do not match",
      });
    }
  });

// TypeScript type
export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
