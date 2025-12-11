import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { RoleSchemaType } from "../../_types/role_types";

export const useMutationDeleteRole = () => {
  return useMutation({
    mutationKey: ["delete-role"],
    mutationFn: (body: RoleSchemaType) => api.delete(`/role/${body.id}`),
  });
};
