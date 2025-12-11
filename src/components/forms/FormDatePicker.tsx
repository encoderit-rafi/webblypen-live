"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ErrorText from "../base/ErrorText";
import { Label } from "../ui/label";

type FormDatePickerProps = {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  errors: FieldErrors;
};

export default function FormDatePicker({
  label,
  name,
  control,
  errors,
  placeholder = "Pick a date",
  disabled = false,
  className = "",
  minDate = new Date("1900-01-01"),
  maxDate = undefined,
}: FormDatePickerProps) {
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    `w-full !bg-transparent text-left font-normal `,
                    !field.value && "text-muted-foreground",
                    errors[name] && "!border-destructive text-destructive",
                    className
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              {errors[name] && (
                <ErrorText text={errors[name]?.message as string} />
              )}
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(format(date, "yyyy-MM-dd")); // store as YYYY-MM-DD string
                    }
                  }}
                  disabled={(date) => {
                    if (minDate && date < minDate) return true;
                    if (maxDate && date > maxDate) return true;
                    return false;
                  }}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors[name] && <ErrorText text={errors[name]?.message as string} />}
      </div>
    </div>
  );
}
