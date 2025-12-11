import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { omitEmpty } from "@/lib/utils";
import { RecipeSchemaType } from "../../_types/recipe_types";
import { toFormData } from "@/utils/toFormData";

export const useMutationUpdateRecipe = () => {
  return useMutation({
    mutationKey: ["update-Recipe"],
    mutationFn: (body: RecipeSchemaType) => {
      const payload = omitEmpty({
        ...body,
        // branch_id: body.branch_id.id,
        recipe_category_id: body.recipe_category.id,
        recipe_ingredients: body.recipe_ingredients.map((item) => ({
          product_id: item.product.id,
          // brand_id: item.brand_id.id,
          unit_id: item.unit.id,
          quantity: item.quantity,
        })),
        _method: "PUT",
      });
      // const payload =
      //   data.image instanceof File
      //     ? toFormData({ ...data, image: data.image })
      //     : data;
      return api.post(`/recipes/${body.id}`, payload);
    },
  });
};
