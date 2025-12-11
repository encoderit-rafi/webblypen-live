import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { RecipeSchemaType } from "../../_types/recipe_types";
import { omitEmpty } from "@/lib/utils";
import { toFormData } from "@/utils/toFormData";
// import { RecipeType } from "../../_types/recipe_types";

export const useMutationCreateRecipe = () => {
  return useMutation({
    mutationKey: ["create-recipe"],
    mutationFn: (body: RecipeSchemaType) => {
      const payload = omitEmpty({
        ...body,
        // is_active: String(body.is_active) == "1" ? true : false,
        // branch_id: body.branch_id.id,
        recipe_category_id: body.recipe_category.id,
        is_active: true,
        recipe_ingredients: body.recipe_ingredients.map((item) => ({
          product_id: item.product.id,
          // brand_id: item.brand_id.id,
          unit_id: item.unit.id,
          quantity: item.quantity,
        })),
      });
      // const payload =
      //   data.image instanceof File
      //     ? toFormData({ ...data, image: data.image })
      //     : data;

      return api.post("/recipes", payload);
    },
  });
};
