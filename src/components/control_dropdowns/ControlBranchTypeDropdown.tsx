import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";
// import {
//   TBranchesTypeDropdownParams,
//   useQueryGetAllBranchesTypeDropdown,
// } from "@/app/(app)/branches/_api/queries/useQueryGetAllBranchesTypeDropdown";
import { optionsFormat } from "@/utils/optionsFormat";
import { ControlDropdownProps } from "@/types/global";
import {
  TBranchTypesDropdownParams,
  useQueryGetAllBranchTypesDropdown,
} from "@/app/(app)/branches/_api/queries/useQueryGetAllBranchTypesDropdown";

type BranchTypeDropdownProps = ControlDropdownProps & {
  params?: TBranchTypesDropdownParams;
};
export default function ControlBranchTypeDropdown({
  name,
  control,
  errors,
  label = "Branch",
  placeholder = "Select Branch",
  params = {},
}: BranchTypeDropdownProps) {
  const { data, isLoading } = useQueryGetAllBranchTypesDropdown({
    params,
  });
  const options = optionsFormat(data || []);
  console.log("👉 ~ ControlBranchTypeDropdown ~ options:", { data, options });
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
