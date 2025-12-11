"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/forms/FormInput";
import { useEffect } from "react";
import FormCheckbox from "@/components/forms/FormCheckbox";
import {
  InvoiceCategoryFormType,
  InvoiceCategorySchema,
  InvoiceCategorySchemaType,
  InvoiceCategoryType,
} from "../_types/invoice_category_types";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { omitEmpty, showErrors } from "@/lib/utils";
import AppDialog from "@/components/base/AppDialog";
import { ModalType } from "@/types/global";
import { useMutationCreateInvoiceCategory } from "../_api/mutations/useMutationCreateInvoiceCategory";
import { useMutationUpdateInvoiceCategory } from "../_api/mutations/useMutationUpdateInvoiceCategory";
import FormSingleFileUploader from "@/components/forms/FormSingleFileUploader";

type InvoiceCategoryFormProps = ModalType & {
  formData: InvoiceCategoryFormType;
};

export default function InvoiceCategoryForm({
  open,
  onOpenChange,
  formData,
}: InvoiceCategoryFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InvoiceCategorySchemaType>({
    resolver: zodResolver(InvoiceCategorySchema),
    defaultValues: formData.data,
  });

  const queryClient = useQueryClient();
  const { mutate: createInvoiceCategory, isPending } =
    useMutationCreateInvoiceCategory();
  const {
    mutate: updateInvoiceCategory,
    isPending: isPendingUpdateInvoiceCategory,
  } = useMutationUpdateInvoiceCategory();

  useEffect(() => {
    if (formData?.data) {
      const omit = omitEmpty(formData.data);
      reset(omit);
    }
  }, [open, formData.data, reset]);

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Invoice category created successfully!"
        : "Invoice category updated successfully!"
    );
    queryClient.invalidateQueries({
      queryKey: ["get-invoice-categories-query"],
    });
    onOpenChange();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create invoice category."
        : "Failed to update invoice category.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: InvoiceCategorySchemaType) => {
    const isCreate = formData.type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    const payload = omitEmpty({
      ...values,
      id: isCreate ? undefined : formData?.data?.id,
    }) as InvoiceCategoryType;

    (isCreate ? createInvoiceCategory : updateInvoiceCategory)(payload, {
      onSuccess: () => onSuccess(action),
      onError: (e) => onError(action, e),
    });
  };

  return (
    <AppDialog
      open={open}
      title={formData.title || "Invoice Category"}
      buttonText={formData.buttonText}
      isPending={isPending || isPendingUpdateInvoiceCategory}
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
          placeholder="Enter invoice category name"
          errors={errors}
          control={control}
        />

        {/* <FormCheckbox name="is_active" label="Is Active" control={control} /> */}
      </div>
    </AppDialog>
  );
}
