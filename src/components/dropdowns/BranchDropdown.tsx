import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import {
  TBranchesDropdownParams,
  useQueryGetAllBranchesDropdown,
} from "@/app/(app)/branches/_api/queries/useQueryGetAllBranchesDropdown";

type TProps = {
  selected_id: string | number;
  params?: TBranchesDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
  props?: {
    label?: string;
    placeholder?: string;
  };
};

export default function BranchDropdown({
  selected_id,
  params = {},
  onValueChange,
  props = {
    label: "",
    placeholder: "Select Branch",
  },
}: TProps) {
  const { data, isLoading } = useQueryGetAllBranchesDropdown({
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      placeholder="Select Branch"
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
