import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import { TRecipeCategoriesDropdownParams, useQueryGetAllRecipeCategoriesDropdown } from "@/app/(app)/recipe-categories/_api/queries/useQueryGetAllRecipeCategoriesDropdown";


type TProps = {
  selected_id: string | number;
  params?: TRecipeCategoriesDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
};

export default function RecipeCategoriesDropdown({
  selected_id,
  params = {},
  onValueChange,
}: TProps) {
  const { data, isLoading } = useQueryGetAllRecipeCategoriesDropdown(
    {
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      placeholder="Select Recipe Category"
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
