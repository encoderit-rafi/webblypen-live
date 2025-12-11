"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListFilter,
} from "lucide-react";
import { OptionSchemaType } from "@/types/global";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/shadcn-io/spinner";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

type AppSelectDropdownType = {
  hideFilterIcon?: boolean;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  options: OptionSchemaType[];
  selectedOptions?: OptionSchemaType[];
  onValueChange: (item: OptionSchemaType) => void;
};
export function AppSelectDropdown({
  hideFilterIcon = false,
  loading = false,
  disabled = false,
  label = "",
  placeholder = "Select...",
  options,
  selectedOptions = [],
  onValueChange,
}: AppSelectDropdownType) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={loading || disabled || !options?.length}
        className="p-0 w-full"
      >
        {/* {!!label && <Label>{label}</Label>} */}
        <Button
          variant="ghost"
          className="h-8 flex items-center justify-between gap-1.5"
        >
          {loading ? (
            <Spinner key="circle" variant="circle" />
          ) : (
            <ListFilter className={`${hideFilterIcon ? "hidden" : "block"}`} />
          )}
          {!selectedOptions.length ? (
            placeholder
          ) : selectedOptions.length > 1 ? (
            <span>
              {selectedOptions[0].label}{" "}
              <Badge variant={"secondary"} className="size-3 rounded-full">
                +{selectedOptions.length}
              </Badge>
            </span>
          ) : (
            selectedOptions[0].label
          )}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-40">
        {options?.map((options: OptionSchemaType) => {
          const isChecked = selectedOptions.some(
            (item) => item?.id == options.id
          );

          return (
            <DropdownMenuCheckboxItem
              key={options.id}
              checked={isChecked}
              onCheckedChange={() => onValueChange(options)}
              // className={cn("group", { "bg-accent-foreground": isChecked })}
            >
              {options.label}
              {/* <X className="opacity-0 group-hover:opacity-100"  /> */}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
