import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { PermissionSchemaType } from "../../_types/permission_types";

export const useMutationUpdateRolePermissions = () => {
  return useMutation({
    mutationKey: ["update-role-permissions"],
    mutationFn: (body: PermissionSchemaType) =>
      api.post(`/assign-permission-to-role`, { ...body }),
  });
};
