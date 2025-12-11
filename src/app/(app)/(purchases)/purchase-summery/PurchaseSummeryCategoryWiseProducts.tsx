import { AppPagination } from "@/components/base/AppPagination";
import AppSearch from "@/components/base/AppSearch";
import AppStatus from "@/components/base/AppStatus";
import AppTable from "@/components/base/AppTable";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useQueryGetAllPurchaseSummeryCategoryWiseProducts } from "./_api/queries/useQueryGetAllPurchaseSummeryCategoryWiseProducts";
import { useManageUrl } from "@/hooks/use-manage-url";

export default function PurchaseSummeryCategoryWiseProducts() {
  const { getParam } = useManageUrl();
  const enabled = getParam("active_tab") == "category-wise-products";
  const { data, status } = useQueryGetAllPurchaseSummeryCategoryWiseProducts({
    enabled,
  });
  console.log("🚀 ~ PurchaseSummeryCategoryWiseProducts ~ data:", data);
  type PurchaseRequestAPIType = (typeof data)[number];
  const columns: ColumnDef<PurchaseRequestAPIType>[] = [
    {
      header: "Category",
      accessorKey: "category_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Item",
      accessorKey: "product_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return (
          <div className="max-w-xs overflow-hidden whitespace-nowrap truncate">
            {name}
          </div>
        );
      },
    },
    {
      header: "UOM",
      accessorKey: "unit_name",
      cell: (props) => {
        const data = props.cell.row.original;

        const name = props.getValue() as string;

        return (
          <span>
            {name} {data.unit_code && `(${data.unit_code})`}
          </span>
        );
      },
    },
    {
      header: "Quantity",
      accessorKey: "total_quantity",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Min of Cost Price",
      accessorKey: "avg_price",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Total Price",
      accessorKey: "total_amount_using_purchase_price",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="max-w-sm">
          <AppSearch />
        </div>
      </div>
      <AppStatus status={status} is_data={!!data?.length}>
        <AppTable data={data ?? []} columns={columns} />
      </AppStatus>
    </div>
  );
}
