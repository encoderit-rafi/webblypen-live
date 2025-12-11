"use client";

import { Controller, Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type FormCheckboxProps = {
  name: string;
  control: Control<any>;
  label?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
};

export default function FormCheckbox({
  name,
  control,
  label,
  id,
  disabled = false,
  className = "",
}: FormCheckboxProps) {
  return (
    <div className={`flex items-center space-x-1.5 ${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox
            id={id || name}
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
        )}
      />
      {label && (
        <Label
          htmlFor={id || name}
          className={disabled ? "opacity-50" : "capitalize"}
        >
          {label}
        </Label>
      )}
    </div>
  );
}
