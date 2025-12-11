"use client";
import React, { useEffect } from "react";
import { FormInput } from "@/components/forms/FormInput";
import { useForm } from "react-hook-form";
import FormTextarea from "@/components/forms/FormTextarea";
import {
  CategoryFormType,
  CategorySchema,
  CategorySchemaType,
} from "../_types/category_types";
import { zodResolver } from "@hookform/resolvers/zod";
import AppDialog from "@/components/base/AppDialog";
import { ModalType } from "@/types/global";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useMutationCreateCategory } from "../_api/mutations/useMutationCreateCategory";
import { useMutationUpdateCategory } from "../_api/mutations/useMutationUpdateCategory";
import { omitEmpty, showErrors } from "@/lib/utils";

type CategoryFormProps = ModalType & {
  formData: CategoryFormType;
};
export default function CategoryForm({
  open,
  onOpenChange,
  formData,
}: CategoryFormProps) {
  console.log("🚀 ~ CategoryForm ~ formData:", formData);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: formData.data,
  });
  const { mutate: createCategory, isPending } = useMutationCreateCategory();
  const { mutate: updateCategory, isPending: isPendingUpdateCategory } =
    useMutationUpdateCategory();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (formData?.data) {
      const omit = omitEmpty(formData?.data);
      reset(omit);
    }
  }, [open, formData.data, reset]);
  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "Category is created successfully!"
        : "Category is updated successfully!";
    queryClient.invalidateQueries({ queryKey: ["get-categories-query"] });
    toast.success(message);
    onOpenChange();
  };
  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create branch."
        : "Failed to update branch.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: CategorySchemaType) => {
    const isCreate = formData.type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    // const payload = omitEmpty({
    //   ...values,

    //   id: isCreate ? undefined : formData?.data?.id,
    //   parent_id: formData?.data?.parent_id,
    // }) as CategorySchemaType;
    // console.log("🚀 ~ onSubmit ~ payload:", payload);

    (isCreate ? createCategory : updateCategory)(values, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };

  console.log({ errors });
  return (
    <AppDialog
      open={open}
      title={formData.title || ""}
      buttonText={formData.buttonText}
      isPending={isPending || isPendingUpdateCategory}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        {/* <FormSingleFileUploader name="image" control={control} /> */}
        <FormInput
          name="name"
          label="Name"
          placeholder="Enter your name"
          errors={errors}
          control={control}
        />
        <FormInput
          name="code"
          label="Code"
          placeholder="Enter your code"
          errors={errors}
          control={control}
        />
        <FormTextarea
          name="description"
          label="Description"
          placeholder="Enter description"
          errors={errors}
          control={control}
        />
      </div>
    </AppDialog>
  );
}
