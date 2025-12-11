import { EMPTY_OPTIONS_DATA, FORM_DATA } from "@/data/global_data";
import { InventoryFormType } from "../_types/inventory_types";

export const INITIAL_FORM_DATA: InventoryFormType = {
  ...FORM_DATA,
  data: {
    branch_id: EMPTY_OPTIONS_DATA,
    product_id: EMPTY_OPTIONS_DATA,
    quantity: 0,
    // action: "add",
  },
};
