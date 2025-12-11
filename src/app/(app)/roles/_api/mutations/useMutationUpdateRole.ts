import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { RoleSchemaType } from "../../_types/role_types";

export const useMutationUpdateRole = () => {
  return useMutation({
    mutationKey: ["update-role"],
    mutationFn: (body: RoleSchemaType) =>
      api.post(`/role/${body.id}`, { ...body, _method: "PUT" }),
  });
};
