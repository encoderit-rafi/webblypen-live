import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import {
  TSuppliersDropdownParams,
  useQueryGetAllSuppliersDropdown,
} from "@/app/(app)/suppliers/_api/queries/useQueryGetAllSuppliersDropdown";

type TProps = {
  selected_id: string | number;
  params?: TSuppliersDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
};

export default function SupplierDropdown({
  selected_id,
  params = {},
  onValueChange,
}: TProps) {
  const { data, isLoading } = useQueryGetAllSuppliersDropdown({
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      placeholder="Select Supplier"
      onValueChange={(val) => {
        onValueChange(val);
      }}
      options={options}
      selectedOptions={options.filter((item) => item.id == selected_id)}
      loading={isLoading}
      disabled={!options?.length}
    />
  );
}
