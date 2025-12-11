import { LaptopMinimal, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
const themes = [
  { value: "light", name: "Light", icon: <Sun /> },
  { value: "dark", name: "Dark", icon: <Moon /> },
  { value: "system", name: "System", icon: <LaptopMinimal /> },
];
export default function AppThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-0.5">
        {themes.map((item) => {
          const isActive = item.value === theme;
          return (
            <DropdownMenuItem
              key={item.value}
              className={isActive ? "bg-accent text-accent-foreground" : ""}
              onClick={() => setTheme(item.value)}
            >
              {item.icon} {item.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
