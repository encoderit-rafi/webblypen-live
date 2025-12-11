import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { UserSchemaType } from "../../_types/user_types";

export const useMutationDeleteUser = () => {
  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: (body: Pick<UserSchemaType, "id">) =>
      api.delete(`/user/${body.id}`),
  });
};
