import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { RecipeCategorySchemaType } from "../../_types/recipe_category_types";


export const useMutationDeleteRecipeCategory = () => {
  return useMutation({
    mutationKey: ["delete-recipe-category"],
    mutationFn: (body: RecipeCategorySchemaType) => api.delete(`/recipe-categories/${body.id}`),
  });
};
