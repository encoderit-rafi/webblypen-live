import { EMPTY_OPTIONS_DATA, FORM_DATA } from "@/data/global_data";
import { InvoiceSchemaType } from "../_types/invoices_types";

export const INITIAL_FORM_DATA: InvoiceSchemaType = {
  id: "",
  invoice_number: "",
  purchase_id: "",
  po_number: "",
  invoice_date: new Date().toISOString().split("T")[0],
  due_date: new Date().toISOString().split("T")[0],
  // vat: 0,
  total_amount: 0,
  invoice_category: EMPTY_OPTIONS_DATA,
  // supplier_id: EMPTY_OPTIONS_DATA,
  // branch_id: EMPTY_OPTIONS_DATA,
  supplier: EMPTY_OPTIONS_DATA,
  branch: EMPTY_OPTIONS_DATA,
  // status: { id: "", value: "", label: "" },
  purchase: {
    po_number: "",
  },

  payment_info: "",
  note: "",
};
