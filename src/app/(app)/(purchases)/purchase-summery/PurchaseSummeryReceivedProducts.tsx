import { AppPagination } from "@/components/base/AppPagination";
import AppSearch from "@/components/base/AppSearch";
import AppStatus from "@/components/base/AppStatus";
import AppTable from "@/components/base/AppTable";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useQueryGetAllPurchaseSummeryReceivedProducts } from "./_api/queries/useQueryGetAllPurchaseSummeryReceivedProducts";
import { useManageUrl } from "@/hooks/use-manage-url";

export default function PurchaseSummeryReceivedProducts() {
  const { getParam } = useManageUrl();
  const enabled = getParam("active_tab") == "received-products";

  const { data, status } = useQueryGetAllPurchaseSummeryReceivedProducts({
    // enabled,
  });
  type PurchaseRequestAPIType = (typeof data.data)[number];
  const columns: ColumnDef<PurchaseRequestAPIType>[] = [
    {
      header: "Purchase Date",
      accessorKey: "purchase_date",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Supplier",
      accessorKey: "supplier_name",
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
      header: "PO Number",
      accessorKey: "po_number",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Product",
      accessorKey: "product_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Category",
      accessorKey: "category_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Receive By",
      accessorKey: "received_by_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Receive Quantity",
      accessorKey: "receive_quantity",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "UOM",
      accessorKey: "unit_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Price",
      accessorKey: "unit_price",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Total Price",
      accessorKey: "total_price",
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
      <AppStatus status={status} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
    </div>
  );
}
