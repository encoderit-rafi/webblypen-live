import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import { ActionsType } from "@/types/global";
type AppActionsDropdownProps = {
  disabled?: boolean;
  actions: ActionsType[];
};

export default function AppActionsDropdown({
  disabled = false,
  actions,
}: AppActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"} disabled={disabled}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-2">
        {actions.map(({ type, label, variant, icon, action }) => (
          <DropdownMenuItem key={label} onClick={action} variant={variant}>
            {icon}
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
