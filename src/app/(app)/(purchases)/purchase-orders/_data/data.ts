import { EMPTY_OPTIONS_DATA, FORM_DATA } from "@/data/global_data";
import { PurchaseOrderSchemaType } from "../_types/purchase_order_types";

export const INITIAL_DATA: PurchaseOrderSchemaType = {
  id: "",
  purchase_request_id: "",
  supplier: {
    id: "",
    name: "",
  },
  branch: {
    id: "",
    name: "",
  },
  purchase_date: "",
  expected_delivery_date: "",
  note: "",
  vat_percentage: "",
  vat_amount: "",
  w_tax_percentage: "",
  w_tax_amount: "",
  non_vatable_amount: "",
  vatable_amount: "",
  total_amount: "",
  due_amount: "",
  purchase_items: [],
};
