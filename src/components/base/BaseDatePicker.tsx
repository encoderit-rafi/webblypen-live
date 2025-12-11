"use client";

import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";

type BaseDatePickerProps = {
  value?: string;
  onSelect: (val: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

export default function BaseDatePicker({
  // field,
  value,
  placeholder = "Pick a date",
  disabled = false,
  invalid = false,
  minDate,
  maxDate,
  onSelect,
}: BaseDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full !bg-transparent text-left font-normal",
            !value && "text-muted-foreground"
          )}
          aria-invalid={invalid}
          disabled={disabled}
        >
          {value ? format(new Date(value), "PPP") : placeholder}
          <CalendarIcon className="ml-auto size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            if (!!date) {
              onSelect(date); // store as YYYY-MM-DD string
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
  );
}
