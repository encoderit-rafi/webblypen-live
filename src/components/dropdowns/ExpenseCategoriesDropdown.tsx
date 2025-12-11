import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import {
  TExpenseCategoriesDropdownParams,
  useQueryGetAllExpenseCategoriesDropdown,
} from "@/app/(app)/expense-categories/_api/queries/useQueryGetAllExpenseCategoriesDropdown";

type TProps = {
  selected_id: string | number;
  params?: TExpenseCategoriesDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
};

export default function ExpenseCategoriesDropdown({
  selected_id,
  params = {},
  onValueChange,
}: TProps) {
  const { data, isLoading } = useQueryGetAllExpenseCategoriesDropdown({
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      placeholder="Select Expense Category"
      onValueChange={(val) => {
        onValueChange(val);
      }}
      options={options}
      selectedOptions={options.filter((item) => item.id == selected_id)}
      loading={isLoading}
      disabled={!options?.length}
    />
  );
}
