import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";

import { optionsFormat } from "@/utils/optionsFormat";
import {
  TBrandsDropdownParams,
  useQueryGetAllBrandsDropdown,
} from "@/app/(app)/brands/_api/queries/useQueryGetAllBrandsDropdown";
import { ControlDropdownProps } from "@/types/global";

type BrandDropdownProps = ControlDropdownProps & {
  params?: TBrandsDropdownParams;
};

export default function ControlBrandDropdown({
  name,
  control,
  errors,
  label = "Brand",
  placeholder = "Select Brand",
  params = {},
}: BrandDropdownProps) {
  const { data, isLoading } = useQueryGetAllBrandsDropdown({
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
