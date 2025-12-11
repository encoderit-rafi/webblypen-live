import {
  EMPTY_DAILY_TRACK_DATA,
  EMPTY_OPTIONS_DATA,
  FORM_DATA,
} from "@/data/global_data";
import { InventoryDailyTrackSchemaType } from "../_types/inventory_types";
// import { InventoryDailyTrackFormType } from "../_types/inventory_types";
// import { InventoryDailyTrackSchemaFormType } from "../_types/inventory_types";

export const INITIAL_FORM_DATA: InventoryDailyTrackSchemaType = {
  ...EMPTY_DAILY_TRACK_DATA,
  adjusted_variance: 0,
};
