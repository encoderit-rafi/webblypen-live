import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";
import {
  TBranchesDropdownParams,
  useQueryGetAllBranchesDropdown,
} from "@/app/(app)/branches/_api/queries/useQueryGetAllBranchesDropdown";
import { optionsFormat } from "@/utils/optionsFormat";
import { ControlDropdownProps } from "@/types/global";
import FormComboBox from "../forms/FormComboBox";

type BranchComboBoxProps = ControlDropdownProps & {
  params?: TBranchesDropdownParams;
};
export default function ControlBranchComboBox({
  name,
  control,
  errors,
  label = "Branch",
  placeholder = "Select Branch",
  params = {},
}: BranchComboBoxProps) {
  const { data, isLoading } = useQueryGetAllBranchesDropdown({
    params,
  });
  const options = optionsFormat(data || []);
  return (
    <FormComboBox
      label={label}
      name={name}
      placeholder={placeholder}
      errors={errors}
      control={control}
      options={options}
      disabled={!options.length}
      loading={isLoading}
    />
  );
}
