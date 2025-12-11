import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { IngredientSchemaType } from "../../_types/ingredient_types";
type TProps = {
  id: string | number;
  status: boolean;
};
export const useMutationUpdateIngredientStatus = () => {
  return useMutation({
    mutationKey: ["update-user-status"],
    mutationFn: (body: TProps) =>
      api.put(`/products/update/status/${body.id}`, { ...body }),
  });
};
