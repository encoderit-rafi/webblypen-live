import { FORM_DATA } from "@/data/global_data";
import { ExpenseCategoryFormType } from "../_types/expense_category_types";

export const INITIAL_FORM_DATA: ExpenseCategoryFormType = {
  ...FORM_DATA,
  data: {
    name: "",
    is_active: true,
  },
};
