"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import AppDialog from "@/components/base/AppDialog";
import ControlProductDropdown from "@/components/control_dropdowns/ControlProductDropdown";
import ControlUnitDropdown from "@/components/control_dropdowns/ControlUnitDropdown";
import { FormInput } from "@/components/forms/FormInput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  UnitConversionFormType,
  UnitConversionSchema,
  UnitConversionSchemaType,
} from "../_types/convert_unit_types";
import { useMutationCreateUnitConversion } from "../_api/Mutations/useMutationCreateUnitConvert";
import { useMutationUpdateUnitConversion } from "../_api/Mutations/useMutationUpdateUnitConvert";
import { ModalType } from "@/types/global";
import { INITIAL_FORM_DATA } from "../_data/data";
import { optionFormat } from "@/utils/optionsFormat";
import { showErrors } from "@/lib/utils";

type UnitConversionFormProps = ModalType & {
  formData: UnitConversionFormType;
};

export default function ConversionUnitForm({
  open,
  onOpenChange,
  formData,
}: UnitConversionFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UnitConversionSchemaType>({
    resolver: zodResolver(UnitConversionSchema),
    defaultValues: formData.data,
  });

  const queryClient = useQueryClient();
  const { mutate: createUnitConversion, isPending } =
    useMutationCreateUnitConversion();
  const { mutate: updateUnitConversion, isPending: isPendingUpdate } =
    useMutationUpdateUnitConversion();

  const { data: initialData, type: formType } = formData;
  console.log("🚀 ~ ConversionUnitForm ~ initialData:", initialData);

  useEffect(() => {
    if (formType === "create") {
      reset(INITIAL_FORM_DATA.data);
    } else if (formType === "update") {
      // 🟢 format data just like in PurchaseRequestForm
      const formattedData = {
        ...initialData,
        id: initialData.id,
        product_id: optionFormat(initialData.product),
        base_unit_id: optionFormat(initialData.base_unit),
        conversion_factor: initialData.conversion_factor,
      };
      reset(formattedData);
    }
  }, [formData]);

  useEffect(() => {
    if (!open) {
      reset(INITIAL_FORM_DATA.data);
    }
  }, [open]);

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Unit conversion created successfully!"
        : "Unit conversion updated successfully!"
    );
    queryClient.invalidateQueries({ queryKey: ["get-Unit-Conversions-query"] });
    onOpenChange();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create unit conversion."
        : "Failed to update unit conversion.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: UnitConversionSchemaType) => {
    const isCreate = formType === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    const payload = {
      ...values,
      id: formData.data.id,
    };

    (isCreate ? createUnitConversion : updateUnitConversion)(payload, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };

  return (
    <AppDialog
      open={open}
      title={formData.title || "Unit Conversion"}
      buttonText={formData.buttonText}
      isPending={isPending || isPendingUpdate}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-full">
          <ControlProductDropdown
            name="product_id"
            label="Product"
            // placeholder="Choose one"
            control={control}
            errors={errors}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Default Unit</Label>
          <Input
            value={watch("product_id")?.default_unit?.name || ""}
            placeholder="Select a product"
            disabled
          />
        </div>

        <ControlUnitDropdown
          name="base_unit_id"
          label="Unit"
          placeholder="Choose one"
          control={control}
          errors={errors}
        />
        <div className="col-span-full">
          <FormInput
            type="number"
            name="conversion_factor"
            label="Ratio"
            control={control}
            errors={errors}
          />
        </div>
      </div>
    </AppDialog>
  );
}
