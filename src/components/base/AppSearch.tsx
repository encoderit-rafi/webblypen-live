import { useEffect, useId, useState } from "react";
import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react"; // added XIcon
import { Input } from "@/components/ui/input";
import { ICON_ATTRS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import { useDebounce } from "../ui/multiselect";

export default function AppSearch() {
  const id = useId();
  const { setParams, getParam } = useManageUrl();
  const [search, setSearch] = useState(() => getParam("search") || "");
  const debouncedSearch = useDebounce(search, 300);
  useEffect(() => {
    if (!debouncedSearch) return;
    setParams({ page: 1, search: debouncedSearch });
  }, [debouncedSearch]);
  return (
    <div className="relative min-w-72">
      <Input
        id={id}
        value={search}
        type="search"
        placeholder="Search..."
        className="peer ps-9 pe-16 h-8" // extra padding for clear & submit buttons
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* Left Search Icon */}
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <SearchIcon {...ICON_ATTRS} />
      </div>

      {/* Right side buttons */}
      <div className="absolute inset-y-0 end-0 flex items-center gap-1 pe-1">
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            className="text-muted-foreground/80 hover:text-foreground p-1 rounded-md focus-visible:ring-2 focus-visible:ring-ring/50"
            // onClick={() => setSearch("")}
            onClick={() => {
              setSearch("");
              setParams({ page: 1, search: "" });
            }}
          >
            <XIcon {...ICON_ATTRS} />
          </button>
        )}
        {/* <button
          type="button"
          aria-label="Submit search"
          className="text-muted-foreground/80 hover:text-foreground p-1 rounded-md focus-visible:ring-2 focus-visible:ring-ring/50"
          onClick={() => setParams({ page: 1, search })}
        >
          <ArrowRightIcon {...ICON_ATTRS} />
        </button> */}
      </div>
    </div>
  );
}
