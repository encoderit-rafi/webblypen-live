import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import {
  TCategoriesDropdownParams,
  useQueryGetAllCategoriesDropdown,
} from "@/app/(app)/categories/_api/queries/useQueryGetAllCategoriesDropdown";
// import {
//   TCategoryesDropdownParams,
//   useQueryGetAllCategoryesDropdown,
// } from "@/app/(app)/branches/_api/queries/useQueryGetAllCategoryesDropdown";

type TProps = {
  selected_id: string | number;
  params?: TCategoriesDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
  props?: {
    placeholder: string;
  };
};

export default function CategoryDropdown({
  selected_id,
  params = {},
  onValueChange,
  props = {
    placeholder: "Select Category",
  },
}: TProps) {
  const { data, isLoading } = useQueryGetAllCategoriesDropdown({
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      // placeholder="Select Category"
      onValueChange={(val) => {
        onValueChange(val);
      }}
      options={options}
      selectedOptions={options.filter(
        (item: OptionSchemaType) => item.id == selected_id
      )}
      loading={isLoading}
      disabled={!options?.length}
      {...props}
    />
  );
}
