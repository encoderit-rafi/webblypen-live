import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";
// import {
//   TUsersDropdownParams,
//   useQueryGetAllUsersDropdown,
// } from "@/app/(app)/branches/_api/queries/useQueryGetAllUsersDropdown";
import { optionsFormat } from "@/utils/optionsFormat";
import { ControlDropdownProps } from "@/types/global";
import {
  TUsersDropdownParams,
  useQueryGetAllUsersDropdown,
} from "@/app/(app)/users/_api/queries/useQueryGetAllUsersDropdown";

type UserDropdownProps = ControlDropdownProps & {
  params?: TUsersDropdownParams;
};
export default function ControlUserDropdown({
  name,
  control,
  errors,
  label = "User",
  placeholder = "Select User",
  params = {},
}: UserDropdownProps) {
  const { data, isLoading } = useQueryGetAllUsersDropdown({
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
