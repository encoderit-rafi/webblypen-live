import { PurchaseRequestSchemaType } from "../_types/purchase_request_types";

export const INITIAL_DATA: PurchaseRequestSchemaType = {
  id: "",
  branch: {
    id: "",
    name: "",
  },
  supplier: {
    id: "",
    name: "",
  },
  pr_number: "",
  expected_delivery_date: "",
  purchase_request_items: [],
};
