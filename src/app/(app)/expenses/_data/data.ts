import { EMPTY_OPTIONS_DATA, FORM_DATA } from "@/data/global_data";
import { ExpenseFormType, ExpenseSchemaType } from "../_types/expense_types";

export const INITIAL_FORM_DATA: ExpenseSchemaType = {
  id: "",
  note: "",
  expense_number: "",
  expense_category: EMPTY_OPTIONS_DATA,
  branch: EMPTY_OPTIONS_DATA,
  name: "",
  expense_date: "",
  status: 1,
  amount: 0,
  vat_type: false,
  vat_amount: 0,
};
