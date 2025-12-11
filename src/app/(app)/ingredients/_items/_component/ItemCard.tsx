"use client";
import React from "react";
import AppViewDialog from "@/components/base/AppViewDialog";
import { ModalType } from "@/types/global";
import { useQueryGetItem } from "@/app/(app)/ingredients/_items/_api/queries/useQueryGetItem";
import AppStatus from "../../../../../components/base/AppStatus";
import AppTable from "@/components/base/AppTable";

type TProps = ModalType & {
  title: string;
  id: string | number;
};

const ItemCard = ({ id, title, open, onOpenChange }: TProps) => {
  const { data, status } = useQueryGetItem({
    enabled: !!id,
    id,
  });
  console.log("👉 ~ ItemCard ~ data:", data);

  return (
    <AppViewDialog title={title} open={open} onOpenChange={onOpenChange}>
      <AppStatus status={status} is_data={!!data}>
        <div className="space-y-6 text-sm">
          {/* Item Details */}
          <div className="grid grid-cols-2 gap-4 ">
            <div className="flex flex-col">
              <span className="text-primary font-medium">Name</span>
              <span className="font-semibold">{data?.name}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-primary font-medium">Code</span>
              <span className="font-semibold">{data?.code}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-primary font-medium">Type</span>
              <span className="font-semibold">{data?.type}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-primary font-medium">Category</span>
              <span className="font-semibold">{data?.category?.name}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-primary font-medium">Sub Category</span>
              <span className="font-semibold">
                {data?.sub_category?.name || "—"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-primary font-medium">Default Unit</span>
              <span className="font-semibold">{data?.default_unit?.name}</span>
            </div>

            <div className="col-span-2 flex flex-col">
              <span className="text-primary font-medium">Description</span>
              <span className="font-semibold">{data?.description || "—"}</span>
            </div>
          </div>

          <AppTable
            data={data?.batch_items ?? []}
            columns={[
              {
                header: "Product Name",
                accessorKey: "product",
                cell: (props) => {
                  const data = props.cell.row.original;
                  return data.product.name || "";
                },
              },
              {
                header: "Quantity",
                accessorKey: "quantity",
                cell: (props) => {
                  const data = props.cell.row.original;
                  return data.quantity || "";
                },
              },
              {
                header: "Unit",
                accessorKey: "unit",
                cell: (props) => {
                  const data = props.cell.row.original;
                  return data.unit.name || "";
                },
              },
            ]}
          />
        </div>
      </AppStatus>
    </AppViewDialog>
  );
};

export default ItemCard;
