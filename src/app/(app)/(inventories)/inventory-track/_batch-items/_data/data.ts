import { EMPTY_OPTIONS_DATA } from "@/data/global_data";
import { BatchItemSchemaType } from "../_types/batch_item_types";

export const INITIAL_FORM_DATA: BatchItemSchemaType = {
  id: "",
  branch: EMPTY_OPTIONS_DATA,
  batch_item: EMPTY_OPTIONS_DATA,
  batch_unit: EMPTY_OPTIONS_DATA,
  batch_out_quantity: 1,
  product: EMPTY_OPTIONS_DATA,
  unit: EMPTY_OPTIONS_DATA,
  product_in_quantity: 1,
  note: "",
};
