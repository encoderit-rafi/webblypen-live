import { FORM_DATA } from "@/data/global_data";
import { CategoryFormType } from "../_types/category_types";
export const INITIAL_FORM_DATA: CategoryFormType = {
  ...FORM_DATA,

  data: {
    name: "",
    code: "",
    description: "",
    image: null,
    is_active: true,
    parent_id: "",
  },
};
