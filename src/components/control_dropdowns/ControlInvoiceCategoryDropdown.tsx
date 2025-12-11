import React from "react";
import FormSingleSelect from "../forms/FormSingleSelect";
import {
  TInvoiceCategoriesDropdownParams,
  useQueryGetAllInvoiceCategoriesDropdown,
} from "@/app/(app)/invoice-categories/_api/queries/useQueryGetAllInvoiceCategoriesDropdown";
import { optionsFormat } from "@/utils/optionsFormat";
import { ControlDropdownProps } from "@/types/global";

type InvoiceCategoryDropdownProps = ControlDropdownProps & {
  params?: TInvoiceCategoriesDropdownParams;
};
export default function ControlInvoiceCategoryDropdown({
  name,
  control,
  errors,
  label = "InvoiceCategory",
  placeholder = "Select InvoiceCategory",
  params = {},
}: InvoiceCategoryDropdownProps) {
  const { data, isLoading } = useQueryGetAllInvoiceCategoriesDropdown({
    params,
  });
  const options = optionsFormat(data || []);
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
