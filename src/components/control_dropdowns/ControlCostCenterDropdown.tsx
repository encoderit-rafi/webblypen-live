import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";
import {
  TCostCenterDropdownParams,
  useQueryGetAllCostCentersDropdown,
} from "@/app/(app)/cost-centers/_api/queries/useQueryGetAllCostCentersDropdown";
import { optionsFormat } from "@/utils/optionsFormat";
import { ControlDropdownProps } from "@/types/global";

type CostCenterDropdownProps = ControlDropdownProps & {
  params?: TCostCenterDropdownParams;
};
export default function ControlCostCenterDropdown({
  name,
  control,
  errors,
  label = "CostCenter",
  placeholder = "Select CostCenter",
  params = {},
}: CostCenterDropdownProps) {
  const { data, isLoading } = useQueryGetAllCostCentersDropdown({
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
