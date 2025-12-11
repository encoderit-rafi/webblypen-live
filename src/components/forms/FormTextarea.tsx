"use client";

import { Textarea } from "@/components/ui/textarea";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Label } from "../ui/label";
import ErrorText from "../base/ErrorText"; // Update path if needed

type FormTextareaProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export default function FormTextarea({
  name,
  control,
  errors,
  label,
  placeholder = "",
  className = "",
  disabled = false,
}: FormTextareaProps) {
  const hasError = !!errors[name];

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Textarea
              {...field}
              id={name}
              placeholder={placeholder}
              className={`resize-none ${hasError ? "border-red-500" : ""}`}
              aria-invalid={hasError}
              disabled={disabled}
            />
            {hasError && <ErrorText text={errors[name]?.message as string} />}
          </>
        )}
      />
    </div>
  );
}
