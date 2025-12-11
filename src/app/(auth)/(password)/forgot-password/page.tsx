"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/forms/FormInput";
import { useForgetPassword } from "./_api/useForgetPassword";
import { toast } from "sonner";

// Validation schema
const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutate: forgetPassword, isPending } = useForgetPassword();
  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log("🚀 ~ onSubmit ~ ForgotPasswordFormData:", data);
    forgetPassword(data, {
      onSuccess() {
        toast.success("Please check your email.");
      },
      onError() {
        toast.success("Something went wrong. Please try again.");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <FormInput
              type="email"
              name="email"
              label="Email"
              placeholder="name@example.com"
              errors={errors}
              control={control}
            />
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit" className="w-full" loading={isPending}>
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
