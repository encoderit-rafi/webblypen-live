import { EMPTY_OPTIONS_DATA, FORM_DATA } from "@/data/global_data";
import { InventoryCountFormType } from "../_types/inventory_count_types";

export const INITIAL_FORM_DATA: InventoryCountFormType = {
  ...FORM_DATA,
  data: {
    inventory_count_id: "",
    physical_counts: [],
  },
};
