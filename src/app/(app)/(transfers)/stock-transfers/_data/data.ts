import { EMPTY_OPTIONS_DATA, FORM_DATA } from "@/data/global_data";
import { StockTransferSchemaType } from "../_types/stock_transfer_types";
// import { StockTransferFormType } from "../_types/stock_transfer_types";

const EMPTY_STOCK_TRANSFER_PRODUCT = {
  product: EMPTY_OPTIONS_DATA,
  unit: EMPTY_OPTIONS_DATA,
  request_quantity: 0,
  receive_quantity: 0,
};
export const INITIAL_FORM_DATA: StockTransferSchemaType = {
  from_branch: EMPTY_OPTIONS_DATA,
  to_branch: EMPTY_OPTIONS_DATA,
  note: "",
  id: "",
  transfer_items: [EMPTY_STOCK_TRANSFER_PRODUCT],
};
