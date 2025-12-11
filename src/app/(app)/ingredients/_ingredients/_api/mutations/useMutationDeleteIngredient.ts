import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type DeleteIngredientType = {
  id?: string | number;
};
export const useMutationDeleteIngredient = () => {
  return useMutation({
    mutationKey: ["delete-ingredient"],
    mutationFn: (body: DeleteIngredientType) =>
      api.delete(`/products/${body.id}`),
  });
};
