import { EMPTY_OPTIONS_DATA, FORM_DATA } from "@/data/global_data";
import { WastageSchemaType } from "../_types/wastage_types";

export const INITIAL_FORM_DATA: WastageSchemaType = {
  id: "",
  branch: EMPTY_OPTIONS_DATA,
  product: EMPTY_OPTIONS_DATA,
  unit: EMPTY_OPTIONS_DATA,
  quantity: 0,
  reason: "",
};
