import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { RecipeSchemaType } from "../../_types/recipe_types";

export const useMutationDeleteRecipe = () => {
  return useMutation({
    mutationKey: ["delete-recipe"],
    mutationFn: (body: Pick<RecipeSchemaType, "id">) =>
      api.delete(`/recipes/${body.id}`),
  });
};
