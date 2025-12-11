"use client";

import { Controller, Control } from "react-hook-form";
import { NumberField, Group, Input, Button } from "react-aria-components";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { Label } from "../ui/label";

type FormNumberInputProps = {
  name: string;
  control: Control<any>;
  label?: string;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
};

export default function FormNumberInput({
  name,
  control,
  label = "Number",
  className = "",
  placeholder = "",
  min,
  max,
  step = 1,
  disabled = false,
}: FormNumberInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <NumberField
          aria-label={label}
          onChange={field.onChange}
          value={field.value}
          minValue={min}
          maxValue={max}
          step={step}
          isDisabled={disabled}
        >
          <div className={`*:not-first:mt-1.5 ${className}`}>
            <Label>{label}</Label>
            <Group className="border-input  data-[focus-within]:border-ring data-[focus-within]:ring-ring/50 data-[focus-within]:ring-[3px] relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm shadow-xs transition-[color,box-shadow] data-[disabled]:opacity-50">
              <Input
                className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums"
                placeholder={placeholder}
              />

              <div className="flex h-[calc(100%+2px)] flex-col">
                <Button
                  slot="increment"
                  className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground text-sm disabled:pointer-events-none disabled:opacity-50"
                >
                  <ChevronUpIcon size={12} aria-hidden="true" />
                </Button>
                <Button
                  slot="decrement"
                  className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground text-sm disabled:pointer-events-none disabled:opacity-50"
                >
                  <ChevronDownIcon size={12} aria-hidden="true" />
                </Button>
              </div>
            </Group>
          </div>
        </NumberField>
      )}
    />
  );
}
