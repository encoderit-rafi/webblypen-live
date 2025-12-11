import { EMPTY_OPTIONS_DATA } from "@/data/global_data";
import { IngredientSchemaType } from "../_types/ingredient_types";
// import { IngredientFormType } from "../_types/ingredient_types";

export const INITIAL_DATA: IngredientSchemaType = {
  id: "",
  // generic_name: EMPTY_OPTIONS_DATA,
  name: "",
  generic_name: "",
  code: "",
  // type: "General",
  description: "",
  // image: null,
  low_stock_threshold: 0,
  default_unit_price: 0,
  vat: 0,
  category: EMPTY_OPTIONS_DATA,
  sub_category: EMPTY_OPTIONS_DATA,
  default_unit: EMPTY_OPTIONS_DATA,
  cost_center: EMPTY_OPTIONS_DATA,
  supplier: EMPTY_OPTIONS_DATA,
  is_active: true,
  // is_default: false,
  // status: true,
  is_useable_for_item: false,
  ideal_recovery_rate: 0,
};
