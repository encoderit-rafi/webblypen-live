"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/forms/FormInput";
import FormSingleFileUploader from "@/components/forms/FormSingleFileUploader";
import { useEffect } from "react";
import FormTextarea from "@/components/forms/FormTextarea";
import {
  BrandFormType,
  BrandSchema,
  BrandSchemaType,
  // BrandType,
} from "../_types/brand_types";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationCreateBrand } from "../_api/Mutations/useMutationCreateBrand";
import { useMutationUpdateBrand } from "../_api/Mutations/useMutationUpdateBrand";
import { toast } from "sonner";
import { isAxiosError } from "axios";
// import { omitEmpty } from "@/lib/utils";
import AppDialog from "@/components/base/AppDialog";
import { ModalType } from "@/types/global";
import { showErrors } from "@/lib/utils";

type BrandFormProps = ModalType & {
  formData: BrandFormType;
};

export default function BrandForm({
  open,
  onOpenChange,
  formData,
}: BrandFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BrandSchemaType>({
    resolver: zodResolver(BrandSchema),
    defaultValues: formData.data,
  });

  const queryClient = useQueryClient();
  const { mutate: createBrand, isPending } = useMutationCreateBrand();
  const { mutate: updateBrand, isPending: isPendingUpdateBrand } =
    useMutationUpdateBrand();

  useEffect(() => {
    if (formData?.data) {
      reset(formData.data);
    }
  }, [open, formData.data, reset]);

  console.log("Brand form Data", { formData });

  const isSubmitting = isPending || isPendingUpdateBrand;

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Brand created successfully!"
        : "Brand updated successfully!"
    );
    queryClient.invalidateQueries({ queryKey: ["get-brands-query"] });
    queryClient.invalidateQueries({ queryKey: ["get-brands-query"] });
    onOpenChange();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create" ? "Failed to create Brand." : "Failed to update Brand.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: BrandSchemaType) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    const isCreate = formData.type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    // Transform schema values -> API payload
    // Transform schema values -> API payload
    // const payload: BrandType = omitEmpty({
    //   ...values,
    //   id: isCreate ? undefined : formData?.data?.id,
    //   branch_type_id: Number(values.branch_type?.id),
    // });

    (isCreate ? createBrand : updateBrand)(
      { ...values, id: isCreate ? undefined : formData?.data?.id },
      {
        onSuccess: () => onSuccess(action),
        onError: (e) => onError(action, e),
      }
    );
  };

  return (
    <AppDialog
      open={open}
      title={formData.title || "Brand"}
      buttonText={formData.buttonText}
      isPending={isPending || isPendingUpdateBrand}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <FormSingleFileUploader
          name="image"
          control={control}
          setValue={setValue}
          src={getValues("image") ? String(getValues("image")) : null}
          isSubmitting={isSubmitting}
        />

        <FormInput
          name="name"
          label="Brand Name"
          placeholder="Enter brand name"
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

        {/* <div className="flex items-center gap-4">
          <FormCheckbox
            name="is_default"
            label="Is Default"
            control={control}
          />
          <FormCheckbox name="is_active" label="Is Active" control={control} />
        </div> */}
      </div>
    </AppDialog>
  );
}
