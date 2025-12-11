"use client";

import { useId } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import ErrorText from "../base/ErrorText";

type FormMultiSelectProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;      // Add loading prop here
  className?: string;
};

export default function FormMultiSelect({
  name,
  errors,
  control,
  label,
  options,
  placeholder = "Select options",
  disabled = false,
  loading = false,        // default false
  className = "",
}: FormMultiSelectProps) {
  const id = useId();
  const hasError = !!errors?.[name];
  console.log({options})

  return (
    <div className={`w-full *:not-first:mt-2 ${className}`}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            {loading ? (
              <p className="text-center py-2 text-gray-500">Loading...</p>
            ) : (
              <MultipleSelector
                value={field.value || []}
                onChange={field.onChange}
                disabled={disabled}
                defaultOptions={options}
                placeholder={placeholder}
                hideClearAllButton
                hidePlaceholderWhenSelected
                commandProps={{ label: placeholder }}
                emptyIndicator={
                  <p className="text-center text-sm">No results found</p>
                }
              />
            )}
            {hasError && (
              <ErrorText text={errors?.[name]?.message as string} />
            )}
          </>
        )}
      />
    </div>
  );
}
