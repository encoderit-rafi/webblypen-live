import { optionsFormat } from "@/utils/optionsFormat";
import React from "react";
import { AppSelectDropdown } from "../base/AppSelectDropdown";
import { OptionSchemaType } from "@/types/global";
import {
  EXPENSE_STATUS_DATA,
  INVOICE_STATUS_DATA,
  PO_STATUS_DATA,
  PR_STATUS_DATA,
  TRANSFER_STATUS_DATA,
} from "@/data/global_data";
// import {
//   TStatusDropdownParams,
//   useQueryGetAllStatusDropdown,
// } from "@/app/(app)/branches/_api/queries/useQueryGetAllStatusDropdown";

type TProps = {
  selected_id: string | number;
  // params?: TStatusDropdownParams;
  onValueChange: (val: OptionSchemaType) => void;
  props?: {
    placeholder?: string;
  };
  status:
    | "PR_STATUS_DATA"
    | "TRANSFER_STATUS_DATA"
    | "EXPENSE_STATUS_DATA"
    | "PO_STATUS_DATA"
    | "INVOICE_STATUS_DATA";
};

export default function StatusDropdown({
  selected_id,
  // params = {},
  onValueChange,
  props = {
    placeholder: "Select Status",
  },
  status,
}: TProps) {
  const data = {
    PR_STATUS_DATA,
    TRANSFER_STATUS_DATA,
    EXPENSE_STATUS_DATA,
    PO_STATUS_DATA,
    INVOICE_STATUS_DATA,
  };
  const options = data[status];

  return (
    <AppSelectDropdown
      hideFilterIcon
      placeholder="Select Status"
      onValueChange={(val) => {
        onValueChange(val);
      }}
      options={options}
      selectedOptions={options.filter(
        (item: OptionSchemaType) => item.id == selected_id
      )}
      // loading={isLoading}
      disabled={!options?.length}
      {...props}
    />
  );
}
