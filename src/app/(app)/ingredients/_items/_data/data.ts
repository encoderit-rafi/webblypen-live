import { EMPTY_OPTION } from "@/data/global_data";
import { ItemSchemaType } from "../_types/item_types";

export const INITIAL_FORM_DATA: ItemSchemaType = {
  id: "",
  name: "",
  generic_name: "",
  code: "",
  // type: "Intermediate",
  description: "",
  // image: null,
  // low_stock_threshold: 0,

  category: EMPTY_OPTION,
  sub_category: EMPTY_OPTION,
  default_unit: EMPTY_OPTION,
  cost_center: EMPTY_OPTION,
  item_type: EMPTY_OPTION,
  // ideal_batch_size: 0,
  batch_items: [],
  is_active: true,
  is_default: false,
};
