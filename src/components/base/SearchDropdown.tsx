"use client";

import { useId, useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Spinner } from "../ui/shadcn-io/spinner";

type TProps = {
  options: string[];
  value: string;
  loading: boolean;
  onChange: (value: string) => void; // <-- important
};

export default function SearchDropdown({
  options,
  loading,
  value,
  onChange,
}: TProps) {
  // const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return options.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, options]);

  const noMatch = filtered.length === 0 && query.trim() !== "";

  const addOption = () => {
    const val = query.trim();
    if (!val) return;

    onChange(val); // <-- set form value
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          // id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-input bg-transparent! px-3 font-normal"
          disabled={loading}
        >
          {loading ? (
            <Spinner variant="bars" />
          ) : (
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value || "Select option"}
            </span>
          )}

          <ChevronDownIcon
            size={16}
            className="shrink-0 text-muted-foreground/80"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search..." onValueChange={setQuery} />

          <CommandList>
            {noMatch && query != value ? (
              <div className="p-3 flex items-center justify-between">
                <span>No match. Add “{query}”?</span>
                <Button size="sm" onClick={addOption}>
                  <PlusIcon size={16} className="mr-1" /> Add
                </Button>
              </div>
            ) : (
              <>
                <CommandEmpty>No option found.</CommandEmpty>

                <CommandGroup>
                  <ScrollArea className="h-32">
                    {filtered.map((opt) => (
                      <CommandItem
                        key={opt}
                        value={opt}
                        onSelect={(currentValue) => {
                          onChange(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {opt}
                        {value === opt && (
                          <CheckIcon size={16} className="ml-auto" />
                        )}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
