import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { UserSchemaType } from "../../_types/user_types";

export const useMutationUpdateUserStatus = () => {
  return useMutation({
    mutationKey: ["update-user-status"],
    mutationFn: (body: Pick<UserSchemaType, "id" | "status">) =>
      api.put(`/user/status/update/${body.id}`, { ...body }),
  });
};
