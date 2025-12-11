import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import {
  TUnitsDropdownParams,
  useQueryGetAllUnitsDropdown,
} from "@/app/(app)/units/_api/queries/useQueryGetAllUnitsDropdown";
// import {
//   TUnitsDropdownParams,
//   useQueryGetAllUnitsDropdown,
// } from "@/app/(app)/suppliers/_api/queries/useQueryGetAllUnitsDropdown";

type TProps = {
  selected_id: string | number;
  params?: TUnitsDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
};

export default function UnitDropdown({
  selected_id,
  params = {},
  onValueChange,
}: TProps) {
  const { data, isLoading } = useQueryGetAllUnitsDropdown({
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      placeholder="Select Unit"
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
