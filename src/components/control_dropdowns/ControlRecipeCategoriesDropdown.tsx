import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";

import { optionsFormat } from "@/utils/optionsFormat";
import { ControlDropdownProps } from "@/types/global";
import {
  TRecipeCategoriesDropdownParams,
  useQueryGetAllRecipeCategoriesDropdown,
} from "@/app/(app)/recipe-categories/_api/queries/useQueryGetAllRecipeCategoriesDropdown";

type RecipeCategoryDropdownProps = ControlDropdownProps & {
  params?: TRecipeCategoriesDropdownParams;
};
export default function ControlRecipeCategoryDropdown({
  name,
  control,
  errors,
  label = "Recipe Category",
  placeholder = "Select Recipe Category",
  params = {},
}: RecipeCategoryDropdownProps) {
  const { data, isLoading } = useQueryGetAllRecipeCategoriesDropdown({
    params,
  });
  console.log("🚀 ~ ControlRecipeCategoryDropdown ~ data:", data);
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
