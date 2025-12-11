import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";

import { optionsFormat } from "@/utils/optionsFormat";
import {
  TIngredientsDropdownParams,
  useQueryGetAllIngredientsDropdown,
} from "@/app/(app)/ingredients/_ingredients/_api/queries/useQueryGetAllIngredientsDropdown";
import { ControlDropdownProps } from "@/types/global";
import { EMPTY_PRODUCT_OPTION_DATA } from "@/data/global_data";

type ProductDropdownProps = ControlDropdownProps & {
  params?: TIngredientsDropdownParams;
};

export default function ControlProductDropdown({
  name,
  control,
  errors,
  label = "",
  placeholder = "Select Product",
  params = {},
}: ProductDropdownProps) {
  const { data, isLoading } = useQueryGetAllIngredientsDropdown({
    params,
  });
  console.log("🚀 ~ ControlProductDropdown ~ data:", data);
  const options = optionsFormat(
    data || [],
    Object?.keys(EMPTY_PRODUCT_OPTION_DATA)
  );
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
