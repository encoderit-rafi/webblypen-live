"use client";

import { useId, useState, useMemo } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import ErrorText from "../base/ErrorText"; // your error text component
import { OptionSchemaType } from "@/types/global";
import { Spinner } from "../ui/shadcn-io/spinner";
import { cn } from "@/lib/utils"; // shadcn utility

// Debounce hook
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useMemo(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

type FormComboBoxProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  options: OptionSchemaType[];
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

export default function FormComboBox({
  name,
  control,
  errors,
  label,
  placeholder = "Select option...",
  options,
  className = "",
  disabled = false,
  loading = false,
}: FormComboBoxProps) {
  const id = useId();
  const hasError = !!errors[name];
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  // ✅ Filter options with debounce
  const filteredOptions = useMemo(() => {
    if (!debouncedSearch) return options;
    return options.filter((opt) =>
      opt?.label?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, options]);
  return (
    <div className={`w-full *:not-first:mt-1.5 ${className}`}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selected = options.find(
            (opt) => opt.value === field.value?.value
          );

          // const [search, setSearch] = useState("");
          // const debouncedSearch = useDebounce(search, 300);

          // // ✅ Filter options with debounce
          // const filteredOptions = useMemo(() => {
          //   if (!debouncedSearch) return options;
          //   return options.filter((opt) =>
          //     opt?.label?.toLowerCase().includes(debouncedSearch.toLowerCase())
          //   );
          // }, [debouncedSearch, options]);

          return (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={id}
                    variant="outline"
                    role="combobox"
                    disabled={disabled || loading}
                    aria-invalid={hasError}
                    className={cn(
                      "w-full justify-between capitalize",
                      hasError && "border-red-500"
                    )}
                  >
                    {loading ? (
                      <div className="flex items-center gap-1.5">
                        <Spinner key="circle" variant="circle" />
                        {placeholder}
                      </div>
                    ) : selected ? (
                      <span className="capitalize max-w-[90%] truncate">
                        {selected.label}
                      </span>
                    ) : (
                      placeholder
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search..."
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              field.onChange(option);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                option.value === selected?.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {hasError && <ErrorText text={errors[name]?.message as string} />}
            </>
          );
        }}
      />
    </div>
  );
}
