import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";
import {
  TBranchesDropdownParams,
  useQueryGetAllBranchesDropdown,
} from "@/app/(app)/branches/_api/queries/useQueryGetAllBranchesDropdown";
import { optionsFormat } from "@/utils/optionsFormat";
import { ControlDropdownProps } from "@/types/global";

type BranchDropdownProps = ControlDropdownProps & {
  params?: TBranchesDropdownParams;
};
export default function ControlBranchDropdown({
  name,
  control,
  errors,
  label = "Branch",
  placeholder = "Select Branch",
  params = {},
}: BranchDropdownProps) {
  const { data, isLoading } = useQueryGetAllBranchesDropdown({
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
