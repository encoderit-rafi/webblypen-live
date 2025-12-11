import { EMPTY_OPTIONS_DATA, FORM_DATA } from "@/data/global_data";
import { RecipeSchemaType } from "../_types/recipe_types";

export const INITIAL_FORM_DATA: RecipeSchemaType = {
  id: "",
  name: "",
  code: "",
  recipe_category: EMPTY_OPTIONS_DATA,
  price: 0,
  vat: 0,
  description: "",
  // image: null,
  is_active: true,

  recipe_ingredients: [
    {
      product: EMPTY_OPTIONS_DATA,
      unit: EMPTY_OPTIONS_DATA,
      quantity: 0,
    },
  ],
};
