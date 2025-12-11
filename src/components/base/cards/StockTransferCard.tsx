"use client";
import React from "react";
import AppViewDialog from "../AppViewDialog";
import { ModalType } from "@/types/global";

import { Badge } from "@/components/ui/badge";
import AppTable from "../AppTable";
import { useQueryGetStockTransfer } from "@/app/(app)/(transfers)/stock-transfers/_api/queries/useQueryGetStockTransfer";
import AppStatus from "../AppStatus";
const columns = [
  {
    header: "Product",
    accessorKey: "product.name",
    cell: (props: any) => props.getValue() as string,
  },
  {
    header: "Requested quantity",
    accessorKey: "request_quantity",
    cell: (props: any) => props.getValue() as string,
  },
  {
    header: "Received quantity",
    accessorKey: "receive_quantity",
    cell: (props: any) => props.getValue() as string,
  },
  {
    header: "Unit",
    accessorKey: "unit.name",
    cell: (props: any) => props.getValue() as string,
  },
  {
    header: "Price",
    accessorKey: "unit_price",
    cell: (props: any) => props.getValue() as string,
  },
  {
    header: "Total Price",
    accessorKey: "total_price",
    cell: (props: any) => props.getValue() as string,
  },
];
type TProps = ModalType & {
  title: string;
  id: string | number;
};

const StockTransferCard = ({ id, title, open, onOpenChange }: TProps) => {
  const { data, status } = useQueryGetStockTransfer({
    enabled: !!id,
    id,
  });

  return (
    <AppViewDialog title={title} open={open} onOpenChange={onOpenChange}>
      <AppStatus status={status} is_data={!!data}>
        <div className="space-y-4 text-sm">
          {/* --- Header Info --- */}
          <div className="flex flex-col gap-1 border-b pb-2">
            <div className="flex justify-between">
              <p>
                <strong>Transfer Number:</strong> {data?.transfer_number}
              </p>
              <p>
                <strong>Status:</strong> <Badge>{data?.status_label}</Badge>
              </p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>From:</strong> {data?.from_branch.name}
              </p>
              <p>
                <strong>To:</strong> {data?.to_branch.name}
              </p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Transfer Date:</strong>{" "}
                {new Date(data?.transfer_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Expected Delivery:</strong>{" "}
                {data?.expected_delivery_date
                  ? new Date(data?.expected_delivery_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Note:</strong> {data?.note}
              </p>
            </div>
            {/* <div className="flex justify-between">
              <p>
                <strong>Received Date:</strong>{" "}
                {data?.received_date
                  ? new Date(data?.received_date).toLocaleDateString()
                  : "Pending"}
              </p>
              <p>
                <strong>Is Adjusted:</strong> {data?.is_adjusted ? "Yes" : "No"}
              </p>
            </div> */}
          </div>

          {/* --- Transfer Items --- */}
          <div>
            <h3 className="font-semibold mb-2">Transfer Items</h3>
            <AppTable data={data?.transfer_items ?? []} columns={columns} />
          </div>
        </div>
      </AppStatus>
    </AppViewDialog>
  );
};

export default StockTransferCard;
