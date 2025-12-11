import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import {
  TCostCenterDropdownParams,
  useQueryGetAllCostCentersDropdown,
} from "@/app/(app)/cost-centers/_api/queries/useQueryGetAllCostCentersDropdown";

type TProps = {
  selected_id: string | number;
  params?: TCostCenterDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
  props?: {
    placeholder: string;
  };
};

export default function CostCenterDropdown({
  selected_id,
  params = {},
  onValueChange,
  props = {
    placeholder: "Select Cost Center",
  },
}: TProps) {
  const { data, isLoading } = useQueryGetAllCostCentersDropdown({
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      // placeholder="Select CostCenter"
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
