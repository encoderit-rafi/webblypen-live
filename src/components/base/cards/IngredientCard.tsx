"use client";

import React from "react";
import AppViewDialog from "@/components/base/AppViewDialog";
import { ModalType } from "@/types/global";
import { useQueryGetIngredient } from "@/app/(app)/ingredients/_ingredients/_api/queries/useQueryGetIngredient";
import AppStatus from "../AppStatus";
// import { IngredientFormType } from "@/app/(app)/ingredients/_ingredients/_types/ingredient_types";

type TProps = ModalType & {
  title: string;
  id: string | number;
};

const IngredientCard = ({ id, title, open, onOpenChange }: TProps) => {
  const { data, status } = useQueryGetIngredient({
    enabled: !!id,
    id,
  });

  // helper for display
  const displayValue = (value: any): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  return (
    <AppViewDialog title={title} open={open} onOpenChange={onOpenChange}>
      <AppStatus status={status} is_data={!!data}>
        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Info label="Name" value={data?.name} />
            <Info label="Code" value={data?.code} />
            <Info label="Type" value={data?.type} />
            <Info
              label="Low Stock Threshold"
              value={data?.low_stock_threshold}
            />
            <Info label="Default Unit Price" value={data?.default_unit_price} />
            <Info label="VAT" value={`${data?.vat}%`} />
            <Info
              label="Ideal Recovery Rate"
              value={data?.ideal_recovery_rate}
            />
            <Info label="Is Active" value={data?.is_active ? "Yes" : "No"} />
            <Info
              label="Is Usable for Item"
              value={data?.is_useable_for_item ? "Yes" : "No"}
            />
            <Info label="Default Unit" value={data?.default_unit?.name} />
            <Info label="Category" value={data?.category?.name} />
            <Info label="Sub Category" value={data?.sub_category?.name} />
            <Info label="Supplier" value={data?.supplier?.name} />
            <Info label="Cost Center" value={data?.cost_center?.name} />
          </div>
          <div className="col-span-2 flex flex-col">
            <span className="text-primary font-medium">Description</span>
            <span className="font-semibold">
              {displayValue(data?.description)}
            </span>
          </div>
        </div>
      </AppStatus>
    </AppViewDialog>
  );
};

export default IngredientCard;

// Reusable info block
const Info = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col">
    <span className="text-primary font-medium">{label}</span>
    <span className="font-semibold">{value ?? "—"}</span>
  </div>
);
