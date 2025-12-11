import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import {
  TIngredientsDropdownParams,
  useQueryGetAllIngredientsDropdown,
} from "@/app/(app)/ingredients/_ingredients/_api/queries/useQueryGetAllIngredientsDropdown";
type TProps = {
  selected_id: string | number;
  params?: TIngredientsDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
};

export default function ProductDropdown({
  selected_id,
  params = {},
  onValueChange,
}: TProps) {
  const { data, isLoading } = useQueryGetAllIngredientsDropdown({
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      placeholder="Select Product"
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
