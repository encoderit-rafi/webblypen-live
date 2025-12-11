import { OpenMarketSchemaType } from "../_types/open_market_types";

export const INITIAL_DATA: OpenMarketSchemaType = {
  id: "",
  branch: {
    id: "",
    name: "",
  },
  supplier: {
    id: "",
    name: "",
  },
  purchase_date: "",
  vat_amount: "",
  total_amount: "",
  items: [],
};
