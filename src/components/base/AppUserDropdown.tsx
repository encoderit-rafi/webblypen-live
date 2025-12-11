import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import api from "@/lib/axios";
import { useQueryCurrentUser } from "@/app/(app)/users/_api/queries/useQueryCurrentUser";
import { getImageSrc } from "@/utils/getImageSrc";
import { Spinner } from "../ui/shadcn-io/spinner";
import { useMutationLogoutUser } from "@/app/(app)/users/_api/mutations/useMutationLogoutUser";
import { toast } from "sonner";
function getInitials(name: string) {
  if (!name) return "";

  return name
    .trim() // remove extra spaces
    .split(/\s+/) // split by one or more spaces
    .map((word) => word[0].toUpperCase()) // take first letter
    .join(""); // combine
}
export default function AppUserDropdown() {
  const { data: currentUser } = useQueryCurrentUser();
  const { name, email, avatar } = currentUser ?? {};
  const { mutate: logout, isPending } = useMutationLogoutUser();
  const handleLogout = async () => {
    logout("", {
      onSuccess() {
        localStorage.clear();
        // Sign out from NextAuth
        signOut({ callbackUrl: "/login" })
          .then(() => window.location.reload())
          .then(() => {
            toast.success(`${name} is logout successfully`);
          });
      },
      onError(error) {
        toast.error(`Logout failed. Please try again.`);
        console.log("🧨 Logout API error:", error);
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={getImageSrc(avatar) || ""} />
          <AvatarFallback className="uppercase">
            {/* {getInitials(name)} */}
            {name?.[0] || ""}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-52  " sideOffset={10}>
        <div className="space-y-1 p-2">
          <DropdownMenuLabel className="text-sm p-0">{name}</DropdownMenuLabel>
          <DropdownMenuLabel className="text-muted-foreground text-xs p-0">
            {email}
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator className="mt-2" />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          disabled={isPending}
        >
          {isPending ? <Spinner key="circle" variant="circle" /> : <LogOut />}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
