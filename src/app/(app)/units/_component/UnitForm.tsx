"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/forms/FormInput";
import { useEffect } from "react";
import FormCheckbox from "@/components/forms/FormCheckbox";
import FormTextarea from "@/components/forms/FormTextarea";
import {
  UnitFormType,
  UnitSchema,
  UnitSchemaType,
  UnitType,
} from "../_types/unit_types";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { omitEmpty, showErrors } from "@/lib/utils";
import { useMutationCreateUnit } from "../_api/mutations/useMutationCreateUnit";
import { useMutationUpdateUnit } from "../_api/mutations/useMutationUpdateUnit";
import AppDialog from "@/components/base/AppDialog";
import { ModalType } from "@/types/global";
import { INITIAL_FORM_DATA } from "../_data/data";

type UnitFormProps = ModalType & {
  formData: UnitFormType;
};
export default function UnitForm({
  open,
  onOpenChange,
  formData,
}: UnitFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnitSchemaType>({
    resolver: zodResolver(UnitSchema),
    defaultValues: formData.data,
  });

  const queryClient = useQueryClient();
  const { type: formType } = formData;

  const { mutate: createUnit, isPending } = useMutationCreateUnit();
  const { mutate: updateUnit, isPending: isPendingUpdateUnit } =
    useMutationUpdateUnit();

  useEffect(() => {
    if (formType !== "update") return;

    reset({
      ...formData.data,
      is_active: String(formData.data.is_active) == "1" ? true : false,
    });
  }, [formType, formData.data, reset]);
  useEffect(() => {
    if (open == false) {
      reset(INITIAL_FORM_DATA.data);
    }
  }, [open, reset]);
  // useEffect(() => {
  //   if (formData?.data) reset(formData.data);
  // }, [open, formData.data, reset]);

  console.log({ formData });

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Unit created successfully!"
        : "Unit updated successfully!"
    );
    queryClient.invalidateQueries({ queryKey: ["get-units-query"] });
    onOpenChange();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create" ? "Failed to create unit." : "Failed to update unit.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: UnitSchemaType) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    const isCreate = formData.type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    // const payload = omitEmpty({
    //   ...values,
    //   id: isCreate ? undefined : formData?.data?.id,

    // }) as UnitType;

    (isCreate ? createUnit : updateUnit)(values, {
      onSuccess: () => onSuccess(action),
      onError: (e) => onError(action, e),
    });
  };
  console.log({ errors });

  return (
    <AppDialog
      open={open}
      title={formData.title || "Unit"}
      buttonText={formData.buttonText}
      isPending={isPending || isPendingUpdateUnit}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <FormInput
          name="name"
          label="Unit Name"
          placeholder="Enter Unit name"
          errors={errors}
          control={control}
        />
        <FormInput
          name="code"
          label="Code"
          placeholder="KH"
          errors={errors}
          control={control}
        />
        <FormTextarea
          name="description"
          label="Description"
          placeholder="Enter unit description"
          errors={errors}
          control={control}
        />
        {/* <FormCheckbox name="is_active" label="Is Active" control={control} /> */}
      </div>
    </AppDialog>
  );
}
