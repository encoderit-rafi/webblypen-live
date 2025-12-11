import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorText from "../base/ErrorText";

type FormInputProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "email" | "number";
};

export function FormInput({
  name,
  control,
  errors,
  label,
  disabled,
  placeholder = "",
  type = "text",
}: FormInputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div>
          <Label
            htmlFor={name}
            className={`${errors[name] && "text-destructive"}`}
          >
            {label}
          </Label>
        </div>
      )}
      <div className="space-y-1">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              id={name}
              type={type}
              disabled={disabled}
              placeholder={placeholder}
              className={`peer ${errors[name] ? "border-destructive" : ""}`}
              aria-invalid={errors[name] ? "true" : "false"}
              {...field}
            />
          )}
        />
        {errors[name] && <ErrorText text={errors[name]?.message as string} />}
      </div>
    </div>
  );
}
