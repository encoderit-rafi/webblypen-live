import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";

import { optionsFormat } from "@/utils/optionsFormat";
import { ControlDropdownProps } from "@/types/global";
import {
  TSuppliersDropdownParams,
  useQueryGetAllSuppliersDropdown,
} from "@/app/(app)/suppliers/_api/queries/useQueryGetAllSuppliersDropdown";

type SupplierDropdownProps = ControlDropdownProps & {
  params?: TSuppliersDropdownParams;
};
export default function ControlSupplierDropdown({
  name,
  control,
  errors,
  label = "Supplier",
  placeholder = "Select Supplier",
  params = {},
}: SupplierDropdownProps) {
  const { data, isLoading } = useQueryGetAllSuppliersDropdown({
    params,
  });
  const options = optionsFormat(data || []);
  return (
    <FormSingleSelect
      label={label}
      name={name}
      placeholder={placeholder}
      errors={errors}
      control={control}
      options={options}
      disabled={!options?.length}
      loading={isLoading}
    />
  );
}
