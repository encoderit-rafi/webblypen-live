import { UnitFormType } from "../_types/unit_types";
import { FORM_DATA } from "@/data/global_data";
export const INITIAL_FORM_DATA: UnitFormType = {
  ...FORM_DATA,
  data: {
    name: "",
    code: "",
    description: "",
    is_active: true
  },
};
