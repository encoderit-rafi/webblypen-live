"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/forms/FormInput";
import { useEffect } from "react";
import FormCheckbox from "@/components/forms/FormCheckbox";
import {
  ExpenseCategoryFormType,
  ExpenseCategorySchema,
  ExpenseCategorySchemaType,
  ExpenseCategoryType,
} from "../_types/expense_category_types";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { omitEmpty, showErrors } from "@/lib/utils";
import AppDialog from "@/components/base/AppDialog";
import { ModalType } from "@/types/global";
import { useMutationCreateExpenseCategory } from "../_api/mutations/useMutationCreateExpenseCategory";
import { useMutationUpdateExpenseCategory } from "../_api/mutations/useMutationUpdateExpenseCategory";

type ExpenseCategoryFormProps = ModalType & {
  formData: ExpenseCategoryFormType;
};

export default function ExpenseCategoryForm({
  open,
  onOpenChange,
  formData,
}: ExpenseCategoryFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExpenseCategorySchemaType>({
    resolver: zodResolver(ExpenseCategorySchema),
    defaultValues: formData.data,
  });

  const queryClient = useQueryClient();
  const { mutate: createExpenseCategory, isPending } =
    useMutationCreateExpenseCategory();
  const {
    mutate: updateExpenseCategory,
    isPending: isPendingUpdateExpenseCategory,
  } = useMutationUpdateExpenseCategory();

  useEffect(() => {
    if (formData?.data) {
      const omit = omitEmpty(formData?.data);
      reset(omit);
    }
  }, [open, formData.data, reset]);

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Expense category created successfully!"
        : "Expense category updated successfully!"
    );
    queryClient.invalidateQueries({
      queryKey: ["get-expense-categories-query"],
    });
    onOpenChange();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create expense category."
        : "Failed to update expense category.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: ExpenseCategorySchemaType) => {
    const isCreate = formData.type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    const payload = omitEmpty({
      ...values,
      id: isCreate ? undefined : formData?.data?.id,
    }) as ExpenseCategoryType;

    (isCreate ? createExpenseCategory : updateExpenseCategory)(payload, {
      onSuccess: () => onSuccess(action),
      onError: (e) => onError(action, e),
    });
  };

  return (
    <AppDialog
      open={open}
      title={formData.title || "Expense Category"}
      buttonText={formData.buttonText}
      isPending={isPending || isPendingUpdateExpenseCategory}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        {/* Optional logo */}
        {/* <FormSingleFileUploader
          name="logo"
          control={control}
          src={null}
          setValue={setValue}
        /> */}

        <FormInput
          name="name"
          label="Category Name"
          placeholder="Enter expense category name"
          errors={errors}
          control={control}
        />

        {/* <FormCheckbox name="is_active" label="Is Active" control={control} /> */}
      </div>
    </AppDialog>
  );
}
