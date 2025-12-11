"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";

import {
  // InvoiceFormType,
  InvoiceSchema,
  InvoiceSchemaType,
} from "../_types/invoices_types";
import { GlobalFormType, ModalType } from "@/types/global";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { useMutationCreateInvoice } from "../_api/mutations/useMutationCreateInvoice";

import { useMutationUpdateInvoice } from "../_api/mutations/useMutationUpdateInvoice";

import FormSingleFileUploader from "@/components/forms/FormSingleFileUploader";
// import { useQueryGetAllPurchasesDropdown } from "../../purchase-orders/_api/queries/useQueryGetAllPurchasesDropdown";

import ControlInvoiceCategoryDropdown from "@/components/control_dropdowns/ControlInvoiceCategoryDropdown";
import { useQueryGetAllPurchasesDropdown } from "../../(purchases)/purchase-orders/_api/queries/useQueryGetAllPurchasesDropdown";
import ControlBranchDropdown from "@/components/control_dropdowns/ControlBranchDropdown";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQueryCurrentUser } from "../../users/_api/queries/useQueryCurrentUser";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useQueryGetAllInvoiceCategoriesDropdown } from "../../invoice-categories/_api/queries/useQueryGetAllInvoiceCategoriesDropdown";
import BaseSelect from "@/components/base/BaseSelect";
import { Input } from "@/components/ui/input";
import { useQueryGetAllBranchesDropdown } from "../../branches/_api/queries/useQueryGetAllBranchesDropdown";
import { useQueryGetAllSuppliersDropdown } from "../../suppliers/_api/queries/useQueryGetAllSuppliersDropdown";
import BaseDatePicker from "@/components/base/BaseDatePicker";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQueryGetInvoice } from "../_api/queries/useQueryGetInvoice";
import { EMPTY_OPTIONS_DATA } from "@/data/global_data";
import { omitEmpty, showErrors } from "@/lib/utils";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;
export default function InvoiceForm({ id = "", type, onCancel }: TProps) {
  const { data: currentUser } = useQueryCurrentUser();
  const { data: invoiceCategories, isLoading: isLoadingInvoiceCategories } =
    useQueryGetAllInvoiceCategoriesDropdown({});
  const { data: branches, isLoading: isLoadingBranches } =
    useQueryGetAllBranchesDropdown({});
  const { data: suppliers, isLoading: isLoadingSuppliers } =
    useQueryGetAllSuppliersDropdown({});
  const { branch_id: currentUserBranchID, branch: currentUserBranch } =
    currentUser ?? {};
  const form = useForm<InvoiceSchemaType>({
    resolver: zodResolver(InvoiceSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = form;
  const poNumber = watch("po_number");
  useEffect(() => {
    if (poNumber == null) {
      setValue("po_number", "");
    }
  }, [poNumber]);

  const { data, isLoading: isLoadingInvoice } = useQueryGetInvoice({
    enabled: type == "update" && !!id,
    id: id,
  });
  console.log("👉 ~ InvoiceForm ~ data:", data);
  const { data: poData, isLoading: isLoadingPO } =
    useQueryGetAllPurchasesDropdown({
      enabled: !!poNumber,
      params: {
        po_number: poNumber || "",
      },
    });
  console.log("👉 ~ InvoiceForm ~ poData:", poData);

  const queryClient = useQueryClient();
  const { mutate: createInvoice, isPending } = useMutationCreateInvoice();
  const { mutate: updateInvoice, isPending: isPendingUpdateInvoice } =
    useMutationUpdateInvoice();

  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);

      reset({
        ...omit,
        po_number: data.po_number ? data.po_number : "",
        payment_info: data.payment_info ? data.payment_info : "",
        note: data.note ? data.note : "",
      });
    }
  }, [data, reset, type]);
  useEffect(() => {
    // if (!poData || poData?.length == 0 || isLoadingPO) return;
    if (poData && poData?.length == 0) {
      setValue("purchase_id", "");
      setValue("branch", EMPTY_OPTIONS_DATA);
      setValue("supplier", EMPTY_OPTIONS_DATA);
      setValue("total_amount", 0);
    } else if (poData && poData?.length > 0) {
      const { id, total_amount, branch_id, supplier_id } = poData[0];
      console.log(
        "👉 ~ InvoiceForm ~ poData[0]:",
        branches.find((branch: any) => branch.id == branch_id)
      );
      setValue("purchase_id", id);
      setValue(
        "branch",
        branches.find((branch: any) => branch.id == branch_id)
      );
      setValue(
        "supplier",
        suppliers.find((supplier: any) => supplier.id == supplier_id)
      );
      setValue("total_amount", total_amount);
    }
  }, [poData, isLoadingPO]);
  console.log("Form errors:", errors);
  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Invoice created successfully!"
        : "Invoice updated successfully!"
    );
    queryClient.invalidateQueries({ queryKey: ["get-invoices-query"] });
    reset();
    onCancel();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create Invoice."
        : "Failed to update Invoice.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };
  const onSubmit = (values: InvoiceSchemaType) => {
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    (isCreate ? createInvoice : updateInvoice)(
      {
        ...values,
        id: isCreate ? undefined : id,
      },
      {
        onSuccess: () => onSuccess(action),
        onError: (e) => onError(action, e),
      }
    );
  };

  useEffect(() => {
    if (currentUserBranchID) {
      setValue("branch", currentUserBranch);
    }
  }, [currentUserBranchID]);
  const isLoading =
    isLoadingInvoiceCategories ||
    isLoadingBranches ||
    isLoadingSuppliers ||
    isLoadingInvoice;
  // isLoadingPO;
  const isSubmitting = isPending || isPendingUpdateInvoice;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <Spinner variant="bars" />
      </div>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {type == "create" && (
          <FormSingleFileUploader
            name="inv_doc_from_supplier"
            control={control}
            setValue={setValue}
            src={
              getValues("inv_doc_from_supplier")
                ? String(getValues("inv_doc_from_supplier"))
                : null
            }
            isSubmitting={isSubmitting}
          />
        )}
        {type == "update" && (
          <FormSingleFileUploader
            name="bank_doc"
            control={control}
            setValue={setValue}
            src={getValues("bank_doc") ? String(getValues("bank_doc")) : null}
            isSubmitting={isSubmitting}
          />
        )}

        {/* <ControlInvoiceCategoryDropdown
          name="invoice_category_id"
          label="Select Category"
          placeholder="Choose category"
          control={control}
          errors={errors}
        /> */}
        <FormField
          control={form.control}
          name="invoice_category"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Select Category</FormLabel>
              <FormControl>
                <BaseSelect
                  placeholder="Select a category"
                  options={invoiceCategories}
                  fieldState={fieldState}
                  value={field.value?.id ? String(field.value.id) : ""}
                  onValueChange={(val) => {
                    if (!!val) {
                      const selected = invoiceCategories.find(
                        (b: { id: string | number; name: string }) =>
                          String(b.id) == val
                      );
                      field.onChange(selected);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {["purchase", "purchases", "purchase category"].includes(
          watch("invoice_category")?.name?.toLowerCase() || ""
        ) && (
          // <FormInput
          //   name="po_number"
          //   label="PO Number"
          //   placeholder="Enter PO Number"
          //   errors={errors}
          //   control={control}
          // />

          <FormField
            control={control}
            name="po_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter po number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {isLoadingPO && (
          <div className="flex items-center min-w-20 justify-center">
            <Spinner variant="bars" />
          </div>
        )}
        {/* <FormInput
          name="invoice_number"
          label="Invoice Number"
          placeholder="Enter Invoice Number"
          errors={errors}
          control={control}
        /> */}
        <FormField
          control={control}
          name="invoice_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter invoice number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {!Boolean(currentUserBranchID) && (
          <FormField
            control={form.control}
            name="branch"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <FormControl>
                  <BaseSelect
                    placeholder="Select a branch"
                    options={branches}
                    fieldState={fieldState}
                    value={field.value?.id ? String(field.value.id) : ""}
                    onValueChange={(val) => {
                      if (!!val) {
                        const selected = branches.find(
                          (b: { id: string | number; name: string }) =>
                            String(b.id) == val
                        );
                        field.onChange(selected);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="supplier"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <FormControl>
                <BaseSelect
                  placeholder="Select a supplier"
                  options={suppliers}
                  fieldState={fieldState}
                  value={field.value?.id ? String(field.value.id) : ""}
                  onValueChange={(val) => {
                    if (!!val) {
                      const selected = suppliers.find(
                        (b: { id: string | number; name: string }) =>
                          String(b.id) == val
                      );
                      field.onChange(selected);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormInput
          type="number"
          name="total_amount"
          label="Amount (USD)"
          control={control}
          errors={errors}
        /> */}
        <FormField
          control={control}
          name="total_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormDatePicker
          name="invoice_date"
          label="Invoice Date"
          control={control}
          errors={errors}
        /> */}
        <FormField
          control={control}
          name="invoice_date"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Invoice Date</FormLabel>
              <FormControl>
                <BaseDatePicker
                  placeholder="Select invoice date"
                  value={field.value}
                  invalid={fieldState.invalid}
                  onSelect={(date: Date) => {
                    if (date) {
                      field.onChange(format(date, "yyyy-MM-dd"));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormDatePicker
          name="due_date"
          label="Due Date"
          control={control}
          errors={errors}
        /> */}
        <FormField
          control={control}
          name="due_date"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <BaseDatePicker
                  placeholder="Select due date"
                  value={field.value}
                  invalid={fieldState.invalid}
                  onSelect={(date: Date) => {
                    if (date) {
                      field.onChange(format(date, "yyyy-MM-dd"));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormTextarea
          name="payment_info"
          label="Payment Info"
          placeholder="Enter your payment info"
          errors={errors}
          control={control}
        /> */}
        <FormField
          control={control}
          name="payment_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Info</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your payment info" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter a short note" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="min-w-24"
            onClick={() => {
              reset();
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} className="min-w-24">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
