import { FORM_DATA } from "@/data/global_data";
import { InvoiceCategoryFormType } from "../_types/invoice_category_types";


export const INITIAL_FORM_DATA: InvoiceCategoryFormType = {
  ...FORM_DATA,
  data: {
    name: "",
    is_active: true,
  },
};
