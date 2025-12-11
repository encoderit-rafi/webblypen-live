import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { RecipeCategoryType } from "../../_types/recipe_category_types";

export const useMutationUpdateRecipeCategory = () => {
  return useMutation({
    mutationKey: ["update-recipe-category"],
    mutationFn: (body: RecipeCategoryType) =>
      api.put(`/recipe-categories/${body.id}`, { ...body}),
  });
};
