"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/forms/FormInput";
import { useEffect } from "react";
import FormCheckbox from "@/components/forms/FormCheckbox";
import {
  RecipeCategoryFormType,
  RecipeCategorySchema,
  RecipeCategorySchemaType,
  RecipeCategoryType,
} from "../_types/recipe_category_types";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { omitEmpty, showErrors } from "@/lib/utils";
import AppDialog from "@/components/base/AppDialog";
import { ModalType } from "@/types/global";
import { useMutationCreateRecipeCategory } from "../_api/mutations/useMutationCreateRecipeCategory";
import { useMutationUpdateRecipeCategory } from "../_api/mutations/useMutationUpdateRecipeCategory";
import FormSingleFileUploader from "@/components/forms/FormSingleFileUploader";

type RecipeCategoryFormProps = ModalType & {
  formData: RecipeCategoryFormType;
};

export default function RecipeCategoryForm({
  open,
  onOpenChange,
  formData,
}: RecipeCategoryFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RecipeCategorySchemaType>({
    resolver: zodResolver(RecipeCategorySchema),
    defaultValues: formData.data,
  });
  console.log(errors);

  const queryClient = useQueryClient();
  const { mutate: createRecipeCategory, isPending } =
    useMutationCreateRecipeCategory();
  const {
    mutate: updateRecipeCategory,
    isPending: isPendingUpdateRecipeCategory,
  } = useMutationUpdateRecipeCategory();

  useEffect(() => {
    if (formData?.data) {
      const omit = omitEmpty(formData?.data);
      reset(omit);
    }
  }, [open, formData.data, reset]);

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Recipe category created successfully!"
        : "Recipe category updated successfully!"
    );
    queryClient.invalidateQueries({
      queryKey: ["get-recipe-categories-query"],
    });
    onOpenChange();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create recipe category."
        : "Failed to update recipe category.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: RecipeCategorySchemaType) => {
    const isCreate = formData.type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    const payload = omitEmpty({
      ...values,
      id: isCreate ? undefined : formData?.data?.id,
      is_active: isCreate ? 1 : !!Number(values.is_active),
    }) as RecipeCategoryType;

    (isCreate ? createRecipeCategory : updateRecipeCategory)(payload, {
      onSuccess: () => onSuccess(action),
      onError: (e) => onError(action, e),
    });
  };

  return (
    <AppDialog
      open={open}
      title={formData.title || "Recipe Category"}
      buttonText={formData.buttonText}
      isPending={isPending || isPendingUpdateRecipeCategory}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        {/* <FormSingleFileUploader
          name="logo"
          control={control}
          src={null}
          setValue={setValue}
        /> */}

        <FormInput
          name="name"
          label="Category Name"
          placeholder="Enter name"
          errors={errors}
          control={control}
        />
        <FormInput
          name="code"
          label="Code"
          placeholder="Enter code"
          errors={errors}
          control={control}
        />
        {/* <FormCheckbox name="is_active" label="Is Active" control={control} /> */}
      </div>
    </AppDialog>
  );
}
