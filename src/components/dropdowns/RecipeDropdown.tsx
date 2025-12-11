import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import { TRecipesDropdownParams, useQueryGetAllRecipeCategoriesDropdown } from "@/app/(app)/recipes/_api/queries/useQueryGetAllRecipesDropdown";

type TProps = {
  selected_id: string | number;
  params?: TRecipesDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
};

export default function RecipeDropdown({
  selected_id,
  params = {},
  onValueChange,
}: TProps) {
  const { data, isLoading } = useQueryGetAllRecipeCategoriesDropdown({
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      placeholder="Select Recipe"
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
