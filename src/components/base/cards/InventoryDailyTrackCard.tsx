"use client";
import { format } from "date-fns";
import { ModalType } from "@/types/global";
import AppViewDialog from "../AppViewDialog";
import { useQueryGetKeyItem } from "@/app/(app)/(inventories)/inventory-track/_key-items/_api/queries/useQueryGetKeyItem";
import AppStatus from "../AppStatus";
import AppTable from "../AppTable";

type TProps = ModalType & {
  title: string;
  id: string | number;
};

const InventoryDailyTrackCard = ({ id, title, open, onOpenChange }: TProps) => {
  const { data, status } = useQueryGetKeyItem({
    enabled: !!id,
    id,
  });

  return (
    <AppViewDialog title={title} open={open} onOpenChange={onOpenChange}>
      <AppStatus status={status} is_data={!!data}>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {/* Top Section */}
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Branch: </span>
            {data?.branch?.name}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Ingredient: </span>
            {data?.ingredient?.name}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Unit: </span>
            {data?.unit?.name}
          </div>

          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">
              Total Out Quantity:{" "}
            </span>
            {data?.total_out_quantity}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Recovery Rate: </span>
            {data?.recovery_rate}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">
              Ideal Recovery Rate:{" "}
            </span>
            {data?.ideal_recovery_rate}
          </div>

          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Variance: </span>
            {data?.variance}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">
              Adjusted Variance:{" "}
            </span>
            {data?.adjusted_variance}
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

          {/* Divider for details */}
          <div className="col-span-3 mt-4 mb-2 font-semibold text-primary">
            Ingredient Details
          </div>

          {/* Details Table */}
          <div className="col-span-3">
            <AppTable
              data={data?.details ?? []}
              columns={[
                {
                  // header: "Product",
                  header: "Product",
                  accessorKey: "product",
                  cell: ({ row }) => {
                    const data = row.original;
                    return data?.product?.name;
                  },
                },
                {
                  // header: "Product",
                  header: "Unit",
                  accessorKey: "unit",
                  cell: ({ row }) => {
                    const data = row.original;
                    return data?.unit?.name;
                  },
                },
                {
                  // header: "Product",
                  header: "Total In Qty",
                  accessorKey: "total_in_quantity",
                  cell: ({ row }) => {
                    const data = row.original;
                    return data?.total_in_quantity;
                  },
                },
                {
                  // header: "Product",
                  header: "Out Unit",
                  accessorKey: "out_ingredient_unit",
                  cell: ({ row }) => {
                    const data = row.original;
                    return data?.out_ingredient_unit?.name;
                  },
                },
                {
                  // header: "Product",
                  header: "Total Out Qty",
                  accessorKey: "total_out_quantity",
                  cell: ({ row }) => {
                    const data = row.original;
                    return data?.total_out_quantity;
                  },
                },

                {
                  // header: "Product",
                  header: "Cost Price",
                  accessorKey: "cost_price",
                  cell: ({ row }) => {
                    const data = row.original;
                    return data?.cost_price;
                  },
                },
              ]}
            />
          </div>
        </div>
      </AppStatus>
    </AppViewDialog>
  );
};

export default InventoryDailyTrackCard;
