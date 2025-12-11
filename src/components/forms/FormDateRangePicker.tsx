"use client";

import { Controller, Control } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FormDateRangePickerProps = {
  name: string;
  control: Control<any>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
};

export default function FormDateRangePicker({
  name,
  control,
  placeholder = "Pick a date range",
  disabled = false,
  className = "",
  minDate = new Date("1900-01-01"),
  maxDate = new Date(),
}: FormDateRangePickerProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-between text-left font-normal",
                !field.value?.from && "text-muted-foreground",
                className
              )}
              disabled={disabled}
            >
              {field.value?.from ? (
                field.value.to ? (
                  <>
                    {format(field.value.from, "PPP")} –{" "}
                    {format(field.value.to, "PPP")}
                  </>
                ) : (
                  format(field.value.from, "PPP")
                )
              ) : (
                <span>{placeholder}</span>
              )}
              <CalendarIcon className=" h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={field.value}
              onSelect={field.onChange}
              numberOfMonths={2}
              disabled={(date) => date > maxDate || date < minDate}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
