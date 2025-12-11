import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import {
  TBrandsDropdownParams,
  useQueryGetAllBrandsDropdown,
} from "@/app/(app)/brands/_api/queries/useQueryGetAllBrandsDropdown";
type TProps = {
  selected_id: string | number;
  params?: TBrandsDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
};

export default function BrandDropdown({
  selected_id,
  params = {},
  onValueChange,
}: TProps) {
  const { data, isLoading } = useQueryGetAllBrandsDropdown({
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      placeholder="Select Brand"
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
