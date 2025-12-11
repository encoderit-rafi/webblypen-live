"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { FormInput } from "@/components/forms/FormInput";
// import { omitEmpty } from "@/lib/utils";
import FormTextarea from "@/components/forms/FormTextarea";
import AppDialog from "@/components/base/AppDialog";
// import FormSingleSelect from "@/components/forms/FormSingleSelect";
// import FormMultiSelect from "@/components/forms/FormMultiSelect";

import { useMutationCreateCostCenter } from "../_api/mutations/useMutationCreateCostCenter";
import { useMutationUpdateCostCenter } from "../_api/mutations/useMutationUpdateCostCenter";
// import { useQueryGetAllUsersDropdown } from "../../users/_api/queries/useQueryGetAllUsersDropdown";

import {
  CostCenterSchema,
  CostCenterSchemaType,
  // CostCenterType,
  CostCenterFormType,
} from "../_types/cost-center";
import { ModalType } from "@/types/global";
import { omitEmpty, showErrors } from "@/lib/utils";

// import { useQueryGetAllSuppliersDropdown } from "../../suppliers/_api/queries/useQueryGetAllSuppliersDropdown";
// import { useQueryGetAllCostCenterTypesDropdown } from "../_api/queries/useQueryGetAllCostCenterTypesDropdown";
// import ControlUserDropdown from "@/components/control_dropdowns/ControlUserDropdown";
// import ControlCostCenterTypeDropdown from "@/components/control_dropdowns/ControlCostCenterTypeDropdown";

type CostCenterFormProps = ModalType & {
  formData: CostCenterFormType;
};

export default function CostCenterForm({
  open,
  onOpenChange,
  formData,
}: CostCenterFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    // setValue,
    formState: { errors },
  } = useForm<CostCenterSchemaType>({
    resolver: zodResolver(CostCenterSchema),
    defaultValues: formData.data,
  });

  const queryClient = useQueryClient();
  const { mutate: createCostCenter, isPending } = useMutationCreateCostCenter();
  const { mutate: updateCostCenter, isPending: isPendingUpdateCostCenter } =
    useMutationUpdateCostCenter();

  useEffect(() => {
    if (formData?.data) {
      const omit = omitEmpty(formData?.data);
      reset(omit);
    }
  }, [open, formData.data, reset]);

  console.log({ formData });

  // update all select options

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "CostCenter created successfully!"
        : "CostCenter updated successfully!"
    );
    queryClient.invalidateQueries({ queryKey: ["get-cost-centers-query"] });
    onOpenChange();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create cash center."
        : "Failed to update cash center.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: CostCenterSchemaType) => {
    const isCreate = formData.type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    (isCreate ? createCostCenter : updateCostCenter)(
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
      title={formData.title || "Cost Center"}
      buttonText={formData.buttonText}
      isPending={isPending || isPendingUpdateCostCenter}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <FormInput
          name="name"
          label="Name"
          placeholder="Enter cost center name"
          errors={errors}
          control={control}
        />
      </div>
    </AppDialog>
  );
}
