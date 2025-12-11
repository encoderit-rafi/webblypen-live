"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Controller, Control, FieldErrors } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorText from "../base/ErrorText";

type FormInputPasswordProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label: string;
  placeholder?: string;
};

export function FormInputPassword({
  name,
  control,
  errors,
  label,
  placeholder = "Password",
}: FormInputPasswordProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  return (
    <div className="space-y-1.5">
      <div>
        <Label
          htmlFor={name}
          className={`${errors[name] && "text-destructive"}`}
        >
          {label}
        </Label>
      </div>
      <div className="space-y-1">
        <div className="relative">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Input
                id={name}
                type={isVisible ? "text" : "password"}
                placeholder={placeholder}
                className={`pe-9 ${errors[name] ? "border-red-500" : ""}`}
                aria-invalid={errors[name] ? "true" : "false"}
                {...field}
              />
            )}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px]"
          >
            {isVisible ? (
              <EyeOffIcon size={16} aria-hidden="true" />
            ) : (
              <EyeIcon size={16} aria-hidden="true" />
            )}
          </button>
        </div>
        {errors[name] && <ErrorText text={errors[name]?.message as string} />}
      </div>
    </div>
  );
}
