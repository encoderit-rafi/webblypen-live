import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";

import { optionsFormat } from "@/utils/optionsFormat";
import {
  TUnitsDropdownParams,
  useQueryGetAllUnitsDropdown,
} from "@/app/(app)/units/_api/queries/useQueryGetAllUnitsDropdown";
import { ControlDropdownProps } from "@/types/global";
import { EMPTY_UNIT_OPTION_DATA } from "@/data/global_data";

type UnitDropdownProps = ControlDropdownProps & {
  enabled?: boolean;
  params?: TUnitsDropdownParams;
};

export default function ControlUnitDropdown({
  name,
  control,
  errors,
  label = "",
  placeholder = "Select Unit",
  enabled = true,
  params = {},
}: UnitDropdownProps) {
  const { data, isLoading } = useQueryGetAllUnitsDropdown({
    enabled,
    params,
  });
  const options = optionsFormat(
    data || [],
    Object?.keys(EMPTY_UNIT_OPTION_DATA)
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
