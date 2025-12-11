"use client";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import clsx from "clsx";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/shadcn-io/spinner";
import { useDebounce } from "../ui/multiselect";
import { OptionSchemaType } from "@/types/global";

type Option = {
  id: string | number;
  name: string;
};

type FormFreeComboBoxProps = {
  name: string;
  label?: string;
  control: Control<any>;
  errors?: FieldErrors;
  options: Option[];
  query: OptionSchemaType;
  loading: boolean;
  placeholder?: string;
  setQuery: (val: OptionSchemaType) => void;
};

export default function FormFreeComboBox({
  name,
  label,
  control,
  errors,
  options,
  placeholder = "Select...",
  loading,
  query,
  setQuery,
}: FormFreeComboBoxProps) {
  const [search, setSearch] = useState(query.name);
  const debouncedSearch = useDebounce(search, 300);
  useEffect(() => {
    // if (!debouncedSearch) return;
    setQuery({
      id: String(debouncedSearch),
      name: String(debouncedSearch),
      value: String(debouncedSearch),
      label: String(debouncedSearch),
    });
  }, [debouncedSearch]);
  return (
    <div className="flex flex-col gap-1 relative">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Combobox
            value={field.value}
            // when option selected, update field + query
            onChange={(value: Option) => {
              field.onChange(value);
              setSearch(value?.name || "");
            }}
            by="id"
          >
            <div className="relative">
              {/* Input field */}
              <ComboboxInput
                className={clsx(
                  "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                  errors?.[name] && "border-red-500"
                )}
                // show query text in input, not just selected value
                displayValue={() => search || ""}
                onChange={(e) => {
                  field.onChange({
                    id: e.target.value,
                    name: e.target.value,
                    label: e.target.value,
                    value: e.target.value,
                  });

                  setSearch(e.target.value);
                }}
                placeholder={placeholder}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 px-2.5">
                <ChevronDownIcon className="h-4 w-4" />
              </ComboboxButton>

              {/* Options below the input */}
              <ComboboxOptions className="absolute left-0 top-full p-1 z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-lg border bg-card shadow-lg">
                {!loading && options.length === 0 ? (
                  <div className="cursor-default select-none px-3 py-2 text-sm">
                    No results
                  </div>
                ) : (
                  options.map((opt) => (
                    <ComboboxOption
                      key={opt.id}
                      value={opt}
                      className="group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/10 data-[focus]:bg-white/10 "
                    >
                      <CheckIcon className="h-4 w-4 opacity-0 group-data-[selected]:opacity-100 text-blue-500" />
                      {opt.name}
                    </ComboboxOption>
                  ))
                )}
                {loading && (
                  <div className="cursor-default select-none py-2 flex items-center justify-center">
                    <Spinner key="bars" variant="bars" />
                  </div>
                )}
              </ComboboxOptions>
            </div>
          </Combobox>
        )}
      />

      {errors?.[name] && (
        <p className="text-xs text-red-500">{String(errors[name]?.message)}</p>
      )}
    </div>
  );
}
