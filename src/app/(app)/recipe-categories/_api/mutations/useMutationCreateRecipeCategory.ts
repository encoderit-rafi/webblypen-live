import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

import { toFormData } from "@/utils/toFormData";
import { RecipeCategoryType } from "../../_types/recipe_category_types";



export const useMutationCreateRecipeCategory = () => {
  return useMutation({
    mutationKey: ["create-recipe-category"],
    mutationFn: (body: RecipeCategoryType) => {
      const data =
        body.avatar instanceof File
          ? toFormData({ ...body, avatar: body.avatar }, { indices: true })
          : body;
      return api.post("/recipe-categories", data);
    },
  });

};
