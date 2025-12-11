import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { RoleSchemaType } from "../../_types/role_types";

export const useMutationCreateRole = () => {
  return useMutation({
    mutationKey: ["create-role"],
    mutationFn: (body: RoleSchemaType) => api.post("/role", body),
  });
};
