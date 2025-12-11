import React, { useId } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OptionSchemaType } from "@/types/global";

type AppRadioGroupProps = {
  legend?: string;
  options: OptionSchemaType[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export default function AppRadioGroup({
  legend = "Choose an option",
  options,
  defaultValue,
  onValueChange,
  disabled = false,
  className = "",
}: AppRadioGroupProps) {
  const id = useId();

  return (
    <fieldset className={`space-y-4 ${className}`}>
      {legend && (
        <legend className="text-foreground text-sm leading-none font-medium">
          {legend}
        </legend>
      )}
      <RadioGroup
        className="flex flex-wrap gap-2"
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      >
        {options.map((option) => (
          <div
            key={`${id}-${option.value}`}
            className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                id={`${id}-${option.value}`}
                value={option.value || ""}
                disabled={disabled}
                className="after:absolute after:inset-0"
              />
              <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
