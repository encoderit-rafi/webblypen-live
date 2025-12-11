import { ICON_ATTRS } from "@/data/global_data";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

type AppStatusToggleProps = {
  isActive: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onToggle: () => void;
};

export default function AppStatusToggle({
  isActive,
  isLoading = false,
  disabled = false,
  onToggle,
}: AppStatusToggleProps) {
  const colorClass = isActive ? "text-green-500" : "text-rose-500";
  const iconClasses = cn(colorClass, "size-6 cursor-pointer");
  return (
    <Button onClick={onToggle} disabled={disabled} variant={"ghost"}>
      {isLoading ? (
        <Loader2
          {...ICON_ATTRS}
          className={cn(iconClasses, "text-muted-foreground animate-spin")}
        />
      ) : isActive ? (
        <CircleCheck
          {...ICON_ATTRS}
          className={iconClasses}
          // onClick={onToggle}
        />
      ) : (
        <CircleX {...ICON_ATTRS} className={iconClasses} />
      )}
    </Button>
  );
  // return isLoading ? (
  //   <Loader2
  //     {...ICON_ATTRS}
  //     className={cn(iconClasses, "text-muted-foreground animate-spin")}
  //   />
  // ) : isActive ? (
  //   <CircleCheck {...ICON_ATTRS} className={iconClasses} onClick={onToggle} />
  // ) : (
  //   <CircleX {...ICON_ATTRS} className={iconClasses} onClick={onToggle} />
  // );
}
