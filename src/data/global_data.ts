import { InventoryDailyTrackSchemaType } from "@/app/(app)/(inventories)/inventory-track/_key-items/_types/inventory_types";
import {
  FormType,
  GlobalBranchSchemaType,
  GlobalCategorySchemaType,
  GlobalFormType,
  GlobalProductSchemaType,
  GlobalUnitSchemaType,
  OptionSchemaType,
  ProductOptionsSchemaType,
  URLParamsType,
} from "@/types/global";
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const SEARCH_PARAMS: URLParamsType = {
  page: 1,
  per_page: 10,
  search: "",
};
export const ICON_ATTRS = {
  size: 16,
  className: "opacity-60",
  "aria-hidden": true,
};
export const PRODUCT_TYPE = {
  general: "General",
  intermediate: "Intermediate",
};
export const FORM_DATA: FormType = {
  type: "default",
  title: "",
  description: "",
  buttonText: "default",
};
export const GLOBAL_FORM_DATA: GlobalFormType = {
  type: "default",
  id: "",
  title: "",
  description: "",
};
export const EMPTY_OPTIONS_DATA: OptionSchemaType = {
  id: "",
  value: "",
  label: "",
};
export const EMPTY_OPTION = {
  id: "",
  name: "",
};
export const EMPTY_PRODUCT_OPTION_DATA: ProductOptionsSchemaType = {
  id: 0,
  name: "",
  code: "",
  type: "",
  vat: 0,
  default_unit_id: 0,
  default_unit_price: 0,
  avg_price: 0,
  ideal_batch_size: 0,
  ideal_recovery_rate: 0,
  is_useable_for_item: false,
  default_unit: {
    id: 0,
    name: "",
    code: "",
  },
  units: [],
  batch_items: [
    // {
    //   id: "",
    //   main_product_id: "",
    //   product_id: "",
    //   quantity: "",
    //   unit_id: "",
    //   product: {
    //     id: "",
    //     name: "",
    //     code: "",
    //   },
    //   unit: {
    //     id: "",
    //     name: "",
    //     code: "",
    //   },
    // },
  ],
};
export const EMPTY_UNIT_OPTION_DATA = {
  id: 0,
  code: "",
  conversion_factor: 0,
  name: "",
};
export const PR_STATUS_DATA: (OptionSchemaType & {
  permissions: PermissionKeys; // <-- change from string to PermissionKeys
})[] = [
  {
    id: 1,
    value: "1",
    label: "Pending",
    permissions: "set_status_pending_purchase_request",
  },
  {
    id: 2,
    value: "2",
    label: "Approved",
    permissions: "set_status_approved_purchase_request",
  },
  {
    id: 3,
    value: "3",
    label: "Rejected",
    permissions: "set_status_rejected_purchase_request",
  },
];
export const TRANSFER_STATUS_DATA: (OptionSchemaType & {
  permissions: string;
  request_type: string[];
})[] = [
  {
    id: 1,
    value: "1",
    label: "Pending",
    permissions: "set_status_pending_transfer",
    request_type: ["stock_in", "stock_out"],
  },
  {
    id: 2,
    value: "2",
    label: "Approved",
    permissions: "set_status_approved_transfer",
    request_type: ["stock_out"],
  },
  {
    id: 3,
    value: "3",
    label: "Rejected",
    permissions: "set_status_rejected_transfer",
    request_type: ["stock_in", "stock_out"],
  },
  {
    id: 4,
    value: "4",
    label: "Processing",
    permissions: "set_status_processing_transfer",
    request_type: ["stock_in", "stock_out"],
  },
  {
    id: 5,
    value: "5",
    label: "Received",
    permissions: "set_status_received_transfer",
    request_type: ["stock_in"],
  },
];
export const EXPENSE_STATUS_DATA: (OptionSchemaType & {
  permissions: string;
})[] = [
  {
    id: 1,
    value: "1",
    label: "Pending",
    permissions: "set_status_pending_transfer",
  },
  {
    id: 2,
    value: "2",
    label: "Approved",
    permissions: "set_status_approved_transfer",
  },
  {
    id: 3,
    value: "3",
    label: "Rejected",
    permissions: "set_status_rejected_transfer",
  },
];

export const PO_STATUS_DATA: (OptionSchemaType & {
  permissions: string;
})[] = [
  {
    id: 1,
    value: "1",
    label: "Pending",
    permissions: "set_status_pending_purchase",
  },

  {
    id: 2,
    value: "2",
    label: "Rejected",
    permissions: "set_status_rejected_purchase",
  },
  {
    id: 3,
    value: "3",
    label: "Received",
    permissions: "set_status_received_purchase",
  },
];
export const INVOICE_STATUS_DATA: OptionSchemaType[] = [
  {
    id: 1,
    value: "1",
    label: "Unpaid",
  },
  {
    id: 2,
    value: "2",
    label: "Paid",
  },
];

export const EMPTY_BRANCH_DATA: GlobalBranchSchemaType = {
  id: "",
  name: "",
  branch_type_id: 0,
  code: "",
  address: "",
  phone: "",
  email: "",
  contact_person: "",
  tin_number: "",
  delivery_time: "",
  logo: "",
  is_active: true,
  is_default: false,
  manager_id: null,
};
export const EMPTY_UNIT_DATA: GlobalUnitSchemaType = {
  id: "",
  name: "",
  code: "",
  description: "",
  min_unit_name: "",
  min_unit_code: "",
  min_unit_conversion_factor: "",
  is_active: true,
};
export const EMPTY_CATEGORY_DATA: GlobalCategorySchemaType = {
  id: "",
  name: "",
  code: "",
  description: "",
  image: "",
  is_active: true,
  parent_id: null,
  created_by: 0,
  updated_by: 0,
  parent: undefined,
};
export const EMPTY_PRODUCT_DATA: GlobalProductSchemaType = {
  id: "",
  name: "",
  code: "",
  type: "",
  description: "",
  image: "",
  low_stock_threshold: "",
  category_id: "",
  ideal_recovery_rate: 0,
  is_active: true,
  is_default: false,
  category: EMPTY_CATEGORY_DATA,
  product_units: [],
};
export const EMPTY_DAILY_TRACK_DATA: InventoryDailyTrackSchemaType = {
  id: "",
  branch: EMPTY_BRANCH_DATA,
  ingredient: EMPTY_PRODUCT_DATA,
  ingredient_unit: EMPTY_UNIT_DATA,
  total_out_quantity: 0,
  ideal_recovery_rate: 0,
  recovery_rate: 0,
  variance: 0,
  details: [],
};
export const PERMISSIONS = {
  dashboard: ["view_dashboard"],
  inventory: [
    "view_inventory_module",
    "view_inventory",
    "show_inventory",
    "adjust_stock_inventory",
    "adjust_intermediate_stock_inventory",
    "daily_track_intermediate_stock_inventory",
    "physical_count_inventory",
    "physical_count_store_inventory",
  ],
  daily_key_item: [
    "view_daily_key_item_module",
    "view_daily_key_item",
    "show_daily_key_item",
    "create_daily_key_item",
    "update_daily_key_item",
    "delete_daily_key_item",
  ],
  daily_batch_item: [
    "view_daily_batch_item_module",
    "view_daily_batch_item",
    "show_daily_batch_item",
    "create_daily_batch_item",
    "update_daily_batch_item",
    "delete_daily_batch_item",
  ],
  purchase_request: [
    "view_purchase_request_module",
    "view_purchase_request",
    "show_purchase_request",
    "create_purchase_request",
    "update_purchase_request",
    "delete_purchase_request",
    "set_status_pending_purchase_request",
    "set_status_approved_purchase_request",
    "set_status_rejected_purchase_request",
    "set_status_po_created_purchase_request",
  ],
  purchase: [
    "view_purchase_module",
    "view_purchase",
    "show_purchase",
    "create_purchase",
    "update_purchase",
    "delete_purchase",
    "received_products_purchase",
    "update_payment_status_purchase",
    "set_status_pending_purchase",
    "set_status_approved_purchase",
    "set_status_rejected_purchase",
    "set_status_received_purchase",
    "set_status_refunded_purchase",
  ],
  transfer: [
    "view_transfer_module",
    "view_transfer",
    "show_transfer",
    "create_transfer",
    "update_transfer",
    "delete_transfer",
    "set_status_pending_transfer",
    "set_status_approved_transfer",
    "set_status_rejected_transfer",
    "set_status_processing_transfer",
    "set_status_in_transit_transfer",
    "set_status_received_transfer",
    "set_status_cancelled_transfer",
    "received_products_transfer",
  ],
  invoice_category: [
    "view_invoice_category_module",
    "view_invoice_category",
    "show_invoice_category",
    "create_invoice_category",
    "update_invoice_category",
    "delete_invoice_category",
    "update_status_invoice_category",
  ],
  invoice: [
    "view_invoice_module",
    "view_invoice",
    "show_invoice",
    "create_invoice",
    "update_invoice",
    "delete_invoice",
    "update_status_invoice",
  ],
  expense_category: [
    "view_expense_category_module",
    "view_expense_category",
    "show_expense_category",
    "create_expense_category",
    "update_expense_category",
    "delete_expense_category",
  ],
  expense: [
    "view_expense_module",
    "view_expense",
    "show_expense",
    "create_expense",
    "update_expense",
    "delete_expense",
    "update_status_expense",
  ],
  sale: ["view_sale_module", "import_sale", "view_sale", "export_sale"],
  report: [
    "view_report_module",
    "view_recipe_sale_report",
    "export_recipe_sale_report",
    "view_recipe_sale_monthly_report",
    "export_recipe_sale_monthly_report",
    "view_recipe_sale_category_report",
    "export_recipe_sale_category_report",
  ],
  recipe: [
    "view_recipe_module",
    "view_recipe",
    "show_recipe",
    "create_recipe",
    "update_recipe",
    "delete_recipe",
    "update_status_recipe",
    "export_recipe",
  ],
  recipe_category: [
    "view_recipe_category_module",
    "view_recipe_category",
    "show_recipe_category",
    "create_recipe_category",
    "update_recipe_category",
    "delete_recipe_category",
    "update_status_recipe_category",
  ],
  wastage: [
    "view_wastage_module",
    "view_wastage",
    "show_wastage",
    "create_wastage",
    "update_wastage",
    "delete_wastage",
  ],
  branch: [
    "view_branch_module",
    "view_branch",
    "show_branch",
    "create_branch",
    "update_branch",
    "delete_branch",
    "update_default_branch",
    "update_status_branch",
  ],
  supplier: [
    "view_supplier_module",
    "view_supplier",
    "show_supplier",
    "create_supplier",
    "update_supplier",
    "delete_supplier",
  ],
  cost_center: [
    "view_cost_center_module",
    "view_cost_center",
    "show_cost_center",
    "create_cost_center",
    "update_cost_center",
    "delete_cost_center",
  ],
  category: [
    "view_category_module",
    "view_category",
    "show_category",
    "create_category",
    "update_category",
    "delete_category",
    "update_status_category",
  ],
  product: [
    "view_product_module",
    "view_product",
    "show_product",
    "create_product",
    "update_product",
    "delete_product",
    "update_status_product",
    "update_default_product",
    "import_product",
  ],
  unit: [
    "view_unit_module",
    "view_unit",
    "show_unit",
    "create_unit",
    "update_unit",
    "delete_unit",
    "update_status_unit",
  ],
  product_unit_conversion: [
    "view_product_unit_conversion_module",
    "view_product_unit_conversion",
    "show_product_unit_conversion",
    "create_product_unit_conversion",
    "update_product_unit_conversion",
    "delete_product_unit_conversion",
  ],
  user: [
    "view_user_module",
    "view_user",
    "show_user",
    "create_user",
    "update_user",
    "delete_user",
    "update_status_user",
  ],
  role: [
    "view_role_module",
    "view_role",
    "show_role",
    "create_role",
    "update_role",
    "delete_role",
  ],
  permission: ["view_permission", "assign_permission"],
  open_market_purchase: [
    "view_open_market_purchase_module",
    "view_open_market_purchase",
    "show_open_market_purchase",
    "create_open_market_purchase",
    "update_open_market_purchase",
    "delete_open_market_purchase",
  ],
  report_advanced: [
    "view_inventory_status_report",
    "view_recipe_cost_report",
    "view_material_usage_report",
    "view_supplier_summary_report",
    "view_purchase_summary_report",
    "view_on_hand_stock_report",
    "view_wastage_summary_report",
    "view_transfer_items_track_report",
    "view_transfer_summary_report",
    "view_profit_loss_report",
  ],
} as const;
export type PermissionsMap = typeof PERMISSIONS;
export type PermissionKeys = PermissionsMap[keyof PermissionsMap][number]; // all keys like "view_dashboard" | ...
