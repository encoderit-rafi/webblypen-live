// import { useCurrentUser } from "@/hooks/use-current-user";

// import { useCurrentUser } from "./useCurrentUser";

// export const useUserPermissions = (permissionKeys: string[]) => {
//   const currentUser = useCurrentUser();
//   const userPermissions = currentUser?.data?.permissions ?? {};

//   const result: Record<string, boolean> = {};

//   permissionKeys.forEach((key) => {
//     result[key] = Boolean(userPermissions[key]);
//   });

//   return result;
// };
import { PermissionKeys, PERMISSIONS } from "@/data/global_data";
import { useCurrentUser } from "./useCurrentUser";

// type PermissionsMap = typeof PERMISSIONS;
// type PermissionKeys = PermissionsMap[keyof PermissionsMap][number]; // all keys like "view_dashboard" | ...

export function useUserPermissions<T extends readonly PermissionKeys[]>(
  permissionKeys: T
): Record<T[number], boolean> {
  const currentUser = useCurrentUser();
  const userPermissions = currentUser?.data?.permissions ?? {};

  // ✅ Explicitly assert result as a mutable record
  const result: Record<T[number], boolean> = Object.create(null);

  permissionKeys.forEach((key) => {
    // ✅ TypeScript now accepts this with type assertion on the index
    result[key as T[number]] = Boolean(userPermissions[key]);
  });

  return result;
}
