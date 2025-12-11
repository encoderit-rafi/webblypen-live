import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";

import { optionsFormat } from "@/utils/optionsFormat";
import { ControlDropdownProps } from "@/types/global";
import {
  TExpenseCategoriesDropdownParams,
  useQueryGetAllExpenseCategoriesDropdown,
} from "@/app/(app)/expense-categories/_api/queries/useQueryGetAllExpenseCategoriesDropdown";

type ExpenseCategoryDropdownProps = ControlDropdownProps & {
  params?: TExpenseCategoriesDropdownParams;
};
export default function ControlExpenseCategoryDropdown({
  name,
  control,
  errors,
  label = "Expense Category",
  placeholder = "Select Expense Category",
  params = {},
}: ExpenseCategoryDropdownProps) {
  const { data, isLoading } = useQueryGetAllExpenseCategoriesDropdown({
    params,
  });
  console.log("🚀 ~ ControlExpenseCategoryDropdown ~ data:", data);
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
