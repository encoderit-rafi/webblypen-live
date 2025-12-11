"use client";
import axios from "axios";

import React, { useState } from "react";
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
import Link from "next/link";
import { FormInput } from "@/components/forms/FormInput";
import { FormInputPassword } from "@/components/forms/FormInputPassword";
import { LoginSchema, LoginSchemaType } from "./_types/login_types";
import { INITIAL_FORM_DATA } from "./_data/data";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import { useLogin } from "./_api/mutations/useLogin";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: INITIAL_FORM_DATA,
  });
  const router = useRouter();
  const { update } = useSession();

  const currentUser = useCurrentUser();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: "/", // 👈 force callback URL
      });

      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      } else if (result?.ok) {
        setLoading(false);

        await update(); // ⬅️ force session to update
        await currentUser.refetch(); // ⬅️ now safe to refetch
        toast.success("Logged in successfully!");
        router.replace("/"); // navigate to dashboard
        router.refresh();
      }
    } catch (error) {
      toast.error("Unexpected error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormInput
              type="email"
              name="email"
              label="Email"
              placeholder="name@example.com"
              errors={errors}
              control={control}
            />
            <FormInputPassword
              name="password"
              label="Password"
              errors={errors}
              control={control}
            />
          </CardContent>
          <CardFooter className="mt-4 flex flex-col">
            <Button type="submit" className="w-full" loading={loading}>
              Log in
            </Button>

            <div className="mt-6 text-sm">
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
