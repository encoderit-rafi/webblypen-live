import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type RecipeStatusUpdateType = {
  id: string | number | undefined;
  status: boolean;
};
export const useMutationUpdateRecipeStatus = () => {
  return useMutation({
    mutationKey: ["update-recipe-status"],
    mutationFn: (body: RecipeStatusUpdateType) =>
      api.put(`/recipes/update/status/${body.id}`, { ...body }),
  });
};
