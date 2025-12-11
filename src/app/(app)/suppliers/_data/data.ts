import { FORM_DATA } from "@/data/global_data";
import { SupplierSchemaType } from "../_types/supplier_types";

export const INITIAL_FORM_DATA: SupplierSchemaType = {
  id: "",
  name: "",
  email: "",
  phone: "",
  contact_person: "",
  tin_number: "",
  address: "",
  payment_info: "",
  w_tax: "1",
  is_active: true,
};
