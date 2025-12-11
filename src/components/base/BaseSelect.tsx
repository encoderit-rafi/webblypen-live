import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ControllerFieldState } from "react-hook-form";
type TProps = {
  options: {
    id: string | number;
    name: string;
  }[];
  placeholder?: string;
  fieldState: ControllerFieldState;
} & React.ComponentProps<typeof Select>;
export default function BaseSelect({
  options = [],
  fieldState,
  placeholder = "Select",
  ...field
}: TProps) {
  return (
    <Select {...field} disabled={options?.length == 0}>
      <SelectTrigger aria-invalid={fieldState.invalid} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
