import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { RecipeCategoryStatusUpdateType } from "../../_types/recipe_category_types";

export const useMutationUpdateRecipeCategoryStatus = () => {
  return useMutation({
    mutationKey: ["update-recipe-category-status"],
    mutationFn: (body: RecipeCategoryStatusUpdateType) =>
      api.put(`/recipe-categories/update/status/${body.id}`, { ...body }),
  });
};
