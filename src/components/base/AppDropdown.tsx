"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  // DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { ListFilter } from "lucide-react";
import { OptionSchemaType } from "@/types/global";

export function AppDropdown({
  placeholder = "Select",
  options,
  selectedOptions = [],
  onValueChange,
}: {
  placeholder?: string;
  options: OptionSchemaType[];
  selectedOptions?: OptionSchemaType[] | any[];
  onValueChange: (item: OptionSchemaType) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8">
          {selectedOptions.length < 1
            ? placeholder
            : selectedOptions.length == 1
            ? selectedOptions[0]?.label
            : `Selected (${selectedOptions.length})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* <DropdownMenuLabel>Recipes</DropdownMenuLabel> */}
        {options?.map((options: OptionSchemaType) => (
          <DropdownMenuCheckboxItem
            key={options.id}
            checked={selectedOptions.some((item) => item?.id == options.id)}
            onCheckedChange={() => onValueChange(options)}
          >
            {options.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
