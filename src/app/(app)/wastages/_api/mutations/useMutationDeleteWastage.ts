import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { WastageSchemaType } from "../../_types/wastage_types";

export const useMutationDeleteWastage = () => {
  return useMutation({
    mutationKey: ["delete-wastages"],
    mutationFn: (body: Pick<WastageSchemaType, "id">) =>
      api.delete(`/wastages/${body.id}`),
  });
};
