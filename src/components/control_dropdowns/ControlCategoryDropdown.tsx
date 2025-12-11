import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";

import { optionsFormat } from "@/utils/optionsFormat";
import { ControlDropdownProps } from "@/types/global";
import {
  TCategoriesDropdownParams,
  useQueryGetAllCategoriesDropdown,
} from "@/app/(app)/categories/_api/queries/useQueryGetAllCategoriesDropdown";

type CategoryDropdownProps = ControlDropdownProps & {
  params?: TCategoriesDropdownParams;
};
export default function ControlCategoryDropdown({
  name,
  control,
  errors,
  label = "Category",
  placeholder = "Select Category",
  params = {},
}: CategoryDropdownProps) {
  const { data, isLoading } = useQueryGetAllCategoriesDropdown({
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
