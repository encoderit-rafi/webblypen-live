"use client";

import { format } from "date-fns";
import { ModalType } from "@/types/global";
import AppViewDialog from "../AppViewDialog";
import AppStatus from "../AppStatus";
import AppTable from "../AppTable";
import { useQueryGetBatchItem } from "@/app/(app)/(inventories)/inventory-track/_batch-items/_api/queries/useQueryGetBatchItem";
// import { useQueryGetBatchItem } from "@/app/(app)/(inventories)/inventory-track/_key-items/_api/queries/useQueryGetBatchItem";

type TProps = ModalType & {
  title: string;
  id: string | number;
};

const InventoryBatchItemCard = ({ id, title, open, onOpenChange }: TProps) => {
  const { data, status } = useQueryGetBatchItem({
    enabled: !!id,
    id,
  });
  console.log("👉 ~ InventoryBatchItemCard ~ data:", data);

  return (
    <AppViewDialog title={title} open={open} onOpenChange={onOpenChange}>
      <AppStatus status={status} is_data={!!data}>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {/* ---------- TOP INFO ----------- */}
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Branch: </span>
            {data?.branch?.name}
          </div>

          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Batch Item: </span>
            {data?.batch_item?.name}
          </div>

          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Batch Unit: </span>
            {data?.batch_unit?.name}
          </div>

          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Batch Out Qty: </span>
            {data?.batch_out_quantity}
          </div>

          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Product: </span>
            {data?.product?.name}
          </div>

          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Unit: </span>
            {data?.unit?.name}
          </div>

          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Product In Qty: </span>
            {data?.product_in_quantity}
          </div>

          {/* <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">
              Default Unit Qty:{" "}
            </span>
            {data?.default_unit_quantity}
          </div> */}

          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Cost Price: </span>
            {data?.cost_price}
          </div>

          {data?.note && (
            <div className="p-1 whitespace-nowrap truncate col-span-3">
              <span className="font-semibold text-primary">Note: </span>
              {data?.note}
            </div>
          )}

          <div className="p-1 whitespace-nowrap truncate col-span-3">
            <span className="font-semibold text-primary">Created At: </span>
            {data?.created_at ? format(new Date(data?.created_at), "PPP") : ""}
          </div>

          {/* ---------- TABLE TITLE ----------- */}
          <div className="col-span-3 mt-4 mb-2 font-semibold text-primary">
            Product Details
          </div>

          {/* ---------- DETAILS TABLE ----------- */}
          <div className="col-span-3">
            <AppTable
              data={data?.details ?? []}
              columns={[
                {
                  header: "Product",
                  accessorKey: "product",
                  cell: ({ row }) => row.original.product?.name,
                },
                {
                  header: "Unit",
                  accessorKey: "unit",
                  cell: ({ row }) => row.original.unit?.name,
                },
                {
                  header: "Quantity",
                  accessorKey: "quantity",
                  cell: ({ row }) => row.original.quantity,
                },
                // {
                //   header: "Default Unit Qty",
                //   accessorKey: "default_unit_quantity",
                //   cell: ({ row }) => row.original.default_unit_quantity,
                // },
                {
                  header: "Unit Price",
                  accessorKey: "unit_price",
                  cell: ({ row }) => row.original.unit_price,
                },
                {
                  header: "Total Price",
                  accessorKey: "total_price",
                  cell: ({ row }) => row.original.total_price,
                },
              ]}
            />
          </div>
        </div>
      </AppStatus>
    </AppViewDialog>
  );
};

export default InventoryBatchItemCard;
