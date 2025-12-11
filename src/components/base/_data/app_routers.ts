import { PERMISSIONS } from "@/data/global_data";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Warehouse,
  Users,
  Tag,
  FolderTree,
  Ruler,
  RefreshCw,
  ChefHat,
  BookOpen,
  Receipt,
  FileText,
  TrendingUp,
  BarChart3,
  GitBranch,
  Shield,
  BadgePercent,
  Trash,
  ShoppingBasket,
} from "lucide-react";

export const app_routers = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    // permission: ["view_dashboard"],
    permission: PERMISSIONS.dashboard,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    // permission: ["view_user_module"],
    permission: PERMISSIONS.user,
  },
  {
    title: "Roles",
    url: "/roles",
    icon: Shield,
    // permission: ["view_role_module"],
    permission: PERMISSIONS.role,
  },
  // {
  //   title: "Brands",
  //   url: "/brands",
  //   icon: Tag,
  //   permission: ["view_brand_module"],
  // },
  {
    title: "Purchases",
    icon: ShoppingCart,
    permission: ["view_purchase_module"],
    children: [
      {
        title: "Purchase Requests",
        url: "/purchase-requests",
        // icon: ShoppingCart,
        // permission: ["view_purchase_request_module"],
        permission: PERMISSIONS.purchase_request,
      },
      {
        title: "Purchase Orders",
        url: "/purchase-orders",
        // icon: ShoppingCart,
        // permission: ["view_purchase_module"],
        permission: PERMISSIONS.purchase,
      },
      // {
      //   title: "Purchase Summery",
      //   url: "/purchase-summery",
      //   // icon: ShoppingCart,
      //   permission: ["view_purchase_module"],
      // },
    ],
  },
  {
    title: "Open Market",
    url: "/open-market",
    icon: ShoppingBasket,
    // permission: ["view_open_market_purchase_module"],
    permission: PERMISSIONS.open_market_purchase,
  },
  {
    title: "Branches",
    url: "/branches",
    icon: GitBranch,
    // permission: ["view_branch_module"],
    permission: PERMISSIONS.branch,
  },
  {
    title: "Wastages",
    url: "/wastages",
    icon: Trash,
    // permission: ["view_wastage_module"],
    permission: PERMISSIONS.wastage,
  },
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Users,
    // permission: ["view_supplier_module"],
    permission: PERMISSIONS.supplier,
  },
  {
    title: "Recipe Categories",
    url: "/recipe-categories",
    icon: BookOpen,
    // permission: ["view_recipe_category_module"],
    permission: PERMISSIONS.recipe_category,
  },
  {
    title: "Recipes ",
    url: "/recipes",
    icon: ChefHat,
    // permission: ["view_recipe_module"],
    permission: PERMISSIONS.recipe,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: FolderTree,
    // permission: ["view_category_module"],
    permission: PERMISSIONS.category,
  },

  {
    title: "Cost Centers",
    url: "/cost-centers",
    icon: BadgePercent,
    // permission: ["view_cost_center_module"],
    permission: PERMISSIONS.cost_center,
  },
  {
    title: "Units",
    url: "/units",
    icon: Ruler,
    // permission: ["view_unit_module"],
    permission: PERMISSIONS.unit,
  },
  {
    title: "Convert Units ",
    url: "/convert-units",
    icon: RefreshCw,
    permission: PERMISSIONS.product_unit_conversion,
  },
  {
    title: "Ingredients & Items ",
    url: "/ingredients",
    icon: Package,
    // permission: ["view_product_module"],
    permission: PERMISSIONS.product,
  },

  {
    title: "Inventories",
    icon: Warehouse,
    permission: ["view_inventory"],
    children: [
      {
        title: "Ingredients",
        url: "/inventory-products",
        permission: ["view_inventory"],
      },
      {
        title: "Items",
        url: "/inventory-items",
        permission: ["view_inventory"],
      },
      {
        title: "Physical counts",
        url: "/inventory-counts",
        permission: ["physical_count_inventory"],
      },
      {
        title: "Daily Production",
        url: "/inventory-track",
        permission: ["view_daily_key_item", "view_daily_key_item"],
      },
    ],
  },
  {
    title: "Transfers",
    icon: Truck,
    permission: PERMISSIONS.transfer,
    children: [
      {
        title: "Stock Transfers",
        url: "/stock-transfers",
        permission: PERMISSIONS.transfer,
      },
      // {
      //   title: "Transfer Received Items",
      //   url: "/transfer-summery",
      //   permission: ["view_transfer_module"],
      // },
    ],
  },
  {
    title: "Invoices & Payments ",
    url: "/invoices-and-payments",
    icon: Receipt,
    permission: PERMISSIONS.invoice,
  },
  {
    title: "Invoice Categories",
    url: "/invoice-categories",
    icon: FileText,
    permission: PERMISSIONS.invoice_category,
  },

  {
    title: "Expense Categories",
    url: "/expense-categories",
    icon: FileText,
    permission: PERMISSIONS.expense_category,
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: FileText,
    permission: PERMISSIONS.expense,
  },

  {
    title: "Sales",
    url: "/sales",
    icon: TrendingUp,
    permission: PERMISSIONS.sale,
  },

  {
    title: "Reports",
    icon: BarChart3,
    permission: PERMISSIONS.report,
    children: [
      {
        title: "Inventory Status",
        url: "/report-inventory-status",
        permission: PERMISSIONS.report,
      },
      {
        title: "Recipe Cost",
        url: "/recipe-cost",
        permission: PERMISSIONS.report,
      },
      {
        title: "Material Usage",
        url: "/material-usage",
        permission: PERMISSIONS.report,
      },
      {
        title: "Supplier Summary",
        url: "/supplier-summary",
        permission: PERMISSIONS.report,
      },
      {
        title: "Purchase Summary",
        url: "/purchase-summary",
        permission: PERMISSIONS.report,
      },
      {
        title: "On Hand Stock",
        url: "/on-hand-stock",
        permission: PERMISSIONS.report,
      },
      {
        title: "Wastage Summary",
        url: "/wastage-summary",
        permission: PERMISSIONS.report,
      },
      {
        title: "Transfer Items Track",
        url: "/transfer-items-track",
        permission: PERMISSIONS.report,
      },
      {
        title: "Transfer Branch Summary",
        url: "/transfer-branch-summary",
        permission: PERMISSIONS.report,
      },
      {
        title: "Profit Loss",
        url: "/profit-loss",
        permission: PERMISSIONS.report,
      },
    ],
  },
];
