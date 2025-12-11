import { FORM_DATA } from "@/data/global_data";
import { BrandFormType } from "../_types/brand_types";

export const INITIAL_FORM_DATA: BrandFormType = {
  ...FORM_DATA,
  data: {
    name: "",
    description: "",
    is_active: true,
    is_default: false,
  },
};
