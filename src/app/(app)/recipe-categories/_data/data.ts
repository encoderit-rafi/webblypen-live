import { FORM_DATA } from "@/data/global_data";
import { RecipeCategoryFormType } from "../_types/recipe_category_types";

export const INITIAL_FORM_DATA: RecipeCategoryFormType = {
  ...FORM_DATA,
  data: {
    name: "",
    code: "",
    image: null,
    is_active: true,
  },
};
