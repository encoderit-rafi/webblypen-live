"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInputPassword } from "@/components/forms/FormInputPassword";
import {
  ResetPasswordSchema,
  ResetPasswordType,
} from "./_types/reset-password";
import { useResetPassword } from "./_api/useResetPassword";
import { useManageUrl } from "@/hooks/use-manage-url";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// // Validation schema
// const ResetPasswordSchema = z
//   .object({
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirm_password: z
//       .string()
//       .min(6, "Password must be at least 6 characters"),
//   })
//   .refine((data) => data.password === data.confirm_password, {
//     path: ["confirm_password"],
//     message: "Passwords do not match",
//   });

// type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    // defaultValues: {
    //   password: "",
    //   confirm_password: "",
    // },
  });
  const router = useRouter();

  const { getParams } = useManageUrl();
  const { email, token } = getParams;
  useEffect(() => {
    if (!!email && !!token) {
      setValue("email", email);
      setValue("token", token);
    }
  }, [email, token]);
  const { mutate: resetPassword, isPending } = useResetPassword();
  const onSubmit = (data: ResetPasswordType) => {
    console.log("🚀 ~ onSubmit ~ ResetPasswordFormData:", data);
    resetPassword(data, {
      onSuccess() {
        // console.log("👉 ~ onSubmit ~ response:", response);
        toast.success("Reset password successfully.");
        router.replace("/login");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Set a new password and confirm it to continue.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormInputPassword
              name="password"
              label="Password"
              errors={errors}
              control={control}
            />
            <FormInputPassword
              name="password_confirmation"
              label="Confirm Password"
              errors={errors}
              control={control}
            />
          </CardContent>
          <CardFooter className="mt-6 flex flex-col">
            <Button type="submit" className="w-full" loading={isPending}>
              Confirm
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
