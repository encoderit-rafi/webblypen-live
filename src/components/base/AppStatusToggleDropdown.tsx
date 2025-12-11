import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { OptionSchemaType } from "@/types/global";
import { nanoid } from "nanoid";

type AppStatusToggleDropdownProps = {
  // selectedValue: OptionSchemaType;
  selectedValue: string;
  options: OptionSchemaType[];
  loading: boolean;
  disabled?: boolean;
  onValueChange: (val: string) => void;
};
export default function AppStatusToggleDropdown({
  selectedValue,
  options,
  loading,
  disabled,
  onValueChange,
}: AppStatusToggleDropdownProps) {
  return (
    <Select
      value={selectedValue}
      onValueChange={(val) => {
        onValueChange(val);
      }}
      disabled={disabled || loading || !options.length}
    >
      <SelectTrigger className={`w-full !bg-transparent capitalize`}>
        {loading ? " Loading..." : <SelectValue>{selectedValue}</SelectValue>}
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
        {options.map((option) => (
          <SelectItem
            key={nanoid()}
            value={option.value || ""}
            className="capitalize"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
