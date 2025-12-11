import {
  EMPTY_OPTIONS_DATA,
  EMPTY_PRODUCT_OPTION_DATA,
  FORM_DATA,
} from "@/data/global_data";
import { UnitConversionFormType } from "../_types/convert_unit_types";

export const INITIAL_FORM_DATA: UnitConversionFormType = {
  ...FORM_DATA,
  data: {
    product_id: EMPTY_PRODUCT_OPTION_DATA,
    base_unit_id: EMPTY_OPTIONS_DATA,
    product: EMPTY_OPTIONS_DATA,
    base_unit: EMPTY_OPTIONS_DATA,
    conversion_factor: 1,
  },
};
