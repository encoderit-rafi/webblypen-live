"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
// import toast from "react-hot-toast";
import { ExpenseSchema, ExpenseSchemaType } from "../_types/expense_types";
import { GlobalFormType } from "@/types/global";

import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useMutationCreateExpense } from "../_api/mutations/useMutationCreateExpense";
import { useMutationUpdateExpense } from "../_api/mutations/useMutationUpdateExpense";

import { useQueryCurrentUser } from "@/app/(app)/users/_api/queries/useQueryCurrentUser";

import FormCheckbox from "@/components/forms/FormCheckbox";
import { useQueryGetAllBranchesDropdown } from "../../branches/_api/queries/useQueryGetAllBranchesDropdown";
import { useQueryGetExpense } from "../_api/queries/useQueryGetExpense";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BaseSelect from "@/components/base/BaseSelect";
import { useQueryGetAllExpenseCategoriesDropdown } from "../../expense-categories/_api/queries/useQueryGetAllExpenseCategoriesDropdown";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Input } from "@/components/ui/input";
import BaseDatePicker from "@/components/base/BaseDatePicker";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { omitEmpty, showErrors } from "@/lib/utils";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;
export default function ExpenseForm({ id = "", type, onCancel }: TProps) {
  const { data, isLoading: isLoadingExpense } = useQueryGetExpense({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });
  const form = useForm<ExpenseSchemaType>({
    resolver: zodResolver(ExpenseSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;
  console.log("👉 ~ ExpenseForm ~ errors:", errors);
  // const { data: currentUser } = useQueryCurrentUser();
  useEffect(() => {
    if (type == "create") {
      setValue("status", 1);
    }
  }, [type]);

  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);

      reset({ ...omit, vat_type: data.vat_type == "vat" ? true : false });
    }
  }, [data, reset, type]);

  const { data: currentUser } = useQueryCurrentUser();
  const { branch_id: currentUserBranchID, branch: currentUserBranch } =
    currentUser ?? {};
  useEffect(() => {
    if (currentUserBranchID) {
      setValue("branch", currentUserBranch);
    }
  }, [currentUserBranchID]);
  const { data: branches, isLoading: isLoadingBranches } =
    useQueryGetAllBranchesDropdown({});
  const { data: expenseCategories, isLoading: isLoadingExpenseCategories } =
    useQueryGetAllExpenseCategoriesDropdown({});
  const { mutate: createExpense, isPending } = useMutationCreateExpense();
  const { mutate: updateExpense, isPending: isPendingUpdateExpense } =
    useMutationUpdateExpense();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (currentUserBranchID) {
      setValue("branch", currentUserBranch);
    }
  }, [currentUserBranchID]);
  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "Expense is created successfully!"
        : "Expense is updated successfully!";
    queryClient.invalidateQueries({
      queryKey: ["get-expenses-query"],
    });
    queryClient.invalidateQueries({
      queryKey: ["get-expense-data"],
    });
    toast.success(message);
    reset();
    onCancel();
  };
  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create expense."
        : "Failed to update expense.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: ExpenseSchemaType) => {
    console.log("🚀 ~ Expense ~ values:", values);
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";
    // return;
    (isCreate ? createExpense : updateExpense)(values, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };
  const isLoading =
    isLoadingBranches || isLoadingExpense || isLoadingExpenseCategories;

  const isSubmitting = isPending || isPendingUpdateExpense;

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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
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
            name="expense_category"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Expense Category</FormLabel>
                <FormControl>
                  <BaseSelect
                    placeholder="Select a expense category"
                    options={expenseCategories}
                    fieldState={fieldState}
                    value={field.value?.id ? String(field.value.id) : ""}
                    onValueChange={(val) => {
                      if (!!val) {
                        const selected = expenseCategories.find(
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

          <FormField
            control={control}
            name="expense_date"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Expanse Date</FormLabel>
                <FormControl>
                  <BaseDatePicker
                    placeholder="Select expanse date"
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

          <FormField
            control={control}
            name="amount"
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
          <FormCheckbox name="vat_type" label="Is vatable" control={control} />
          {watch("vat_type") && (
            <FormField
              control={control}
              name="vat_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter vat amount"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

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
