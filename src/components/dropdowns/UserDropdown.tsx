import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import {
  TUsersDropdownParams,
  useQueryGetAllUsersDropdown,
} from "@/app/(app)/users/_api/queries/useQueryGetAllUsersDropdown";
// import {
//   TUsersDropdownParams,
//   useQueryGetAllUsersDropdown,
// } from "@/app/(app)/branches/_api/queries/useQueryGetAllUsersDropdown";

type TProps = {
  selected_id: string | number;
  params?: TUsersDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
  props?: {
    placeholder?: string;
  };
};

export default function UserDropdown({
  selected_id,
  params = {},
  onValueChange,
  props = {
    placeholder: "Select User",
  },
}: TProps) {
  const { data, isLoading } = useQueryGetAllUsersDropdown({
    params,
  });
  const options = optionsFormat(data || []);

  return (
    <AppSelectDropdown
      hideFilterIcon
      placeholder="Select User"
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
