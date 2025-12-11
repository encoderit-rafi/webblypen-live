import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ItemSchemaType } from "../../_types/item_types";

export const useMutationDeleteItem = () => {
  return useMutation({
    mutationKey: ["delete-item"],
    mutationFn: (body: Pick<ItemSchemaType, "id">) =>
      api.delete(`/products/${body.id}`),
  });
};
