"use client";
import { AppPagination } from "@/components/base/AppPagination";
import AppSearch from "@/components/base/AppSearch";
import AppStatus from "@/components/base/AppStatus";
import AppTable from "@/components/base/AppTable";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useQueryGetAllTransferSummery } from "./_api/queries/useQueryGetAllTransferSummery";

export default function TransferSummery() {
  const { data, status } = useQueryGetAllTransferSummery({
    // enabled,
  });
  type TransferSummeryAPIType = (typeof data.data)[number];
  const columns: ColumnDef<TransferSummeryAPIType>[] = [
    {
      header: "Transfer Number",
      accessorKey: "transfer_number",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Transfer Date",
      accessorKey: "transfer_date",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Received Date",
      accessorKey: "received_date",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "From Branch",
      accessorKey: "from_branch_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "To Branch",
      accessorKey: "to_branch_name",
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

        return name;
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
      header: "Request Quantity",
      accessorKey: "request_quantity",
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
      header: "Receive Quantity",
      accessorKey: "receive_quantity",
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
      header: "Price",
      accessorKey: "unit_price",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    // {
    //   header: "Avg Price",
    //   accessorKey: "avg_price",
    //   cell: (props) => {
    //     const name = props.getValue() as string;

    //     return name;
    //   },
    // },
    {
      header: "Total Price",
      accessorKey: "total_price",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    // {
    //   header: "Total Avg Price",
    //   accessorKey: "total_avg_price",
    //   cell: (props) => {
    //     const name = props.getValue() as string;

    //     return name;
    //   },
    // },

    {
      header: "Received By",
      accessorKey: "received_by_name",
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
        {/* <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        /> */}
      </AppStatus>
    </div>
  );
}
