"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorText from "../base/ErrorText";
import { Spinner } from "../ui/shadcn-io/spinner";

type OptionType = {
  id?: string | number;
  name?: string;
  label?: string;
  value?: string | number;
};

type FormSingleSelectProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  options: OptionType[];
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

export default function FormSingleSelect({
  name,
  control,
  errors,
  label,
  placeholder = "Select option",
  options,
  className = "",
  disabled = false,
  loading = false,
}: FormSingleSelectProps) {
  const hasError = !!errors[name];

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && <Label>{label}</Label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const matchedOption =
            options?.find(
              (opt) =>
                opt.id?.toString() == field.value?.id?.toString() ||
                opt.value?.toString() == field.value?.value?.toString()
            ) ?? null;

          const selectedValue =
            matchedOption?.id?.toString() ??
            matchedOption?.value?.toString() ??
            "";

          return (
            <>
              <Select
                value={selectedValue}
                onValueChange={(val) => {
                  const selected =
                    options.find(
                      (opt) =>
                        opt.id?.toString() === val ||
                        opt.value?.toString() === val
                    ) ?? null;
                  field.onChange(selected);
                }}
                disabled={disabled || loading}
              >
                <SelectTrigger
                  className={`w-full !bg-transparent capitalize ${
                    hasError ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue
                    placeholder={
                      loading ? (
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Spinner key="spinner" variant="circle" />
                          Loading...
                        </span>
                      ) : (
                        placeholder
                      )
                    }
                  >
                    {/* 👇 Only show text when something is selected */}
                    {matchedOption?.label ?? matchedOption?.name ?? ""}
                  </SelectValue>
                </SelectTrigger>

                {!loading && (
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem
                        key={
                          option.id?.toString() ??
                          option.value?.toString() ??
                          "opt"
                        }
                        value={
                          option.id?.toString() ??
                          option.value?.toString() ??
                          ""
                        }
                        className="capitalize"
                      >
                        {option.label || option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>

              {hasError && <ErrorText text={errors[name]?.message as string} />}
            </>
          );
        }}
      />
    </div>
  );
}
