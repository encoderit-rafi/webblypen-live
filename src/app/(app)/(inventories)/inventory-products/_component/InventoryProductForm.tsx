"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { ModalType } from "@/types/global";
import AppDialog from "@/components/base/AppDialog";
import {
  InventoryFormType,
  InventorySchema,
  InventorySchemaType,
} from "../_types/inventory_types";
import { useMutationAdjustProductInventory } from "../_api/mutations/useMutationAdjustProductInventory";
import FormNumberInput from "@/components/forms/FormNumberInput";
import { PRODUCT_TYPE } from "@/data/global_data";

import ControlBranchDropdown from "@/components/control_dropdowns/ControlBranchDropdown";
import ControlProductDropdown from "@/components/control_dropdowns/ControlProductDropdown";
import { useQueryCurrentUser } from "@/app/(app)/users/_api/queries/useQueryCurrentUser";
import { showErrors } from "@/lib/utils";

type InventoryFormProps = ModalType & {
  formData: InventoryFormType;
};
const RadioOptions = [
  { value: "add", label: "ADD" },
  { value: "subtract", label: "SUBTRACT" },
];

export default function InventoryProductForm({
  open,
  onOpenChange,
  formData,
}: InventoryFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InventorySchemaType>({
    resolver: zodResolver(InventorySchema),
    defaultValues: formData.data,
  });
  useEffect(() => {
    if (formData?.data) {
      reset(formData.data);
    }
  }, [open, formData.data, reset]);
  const productID = watch(`product_id`)?.id;

  console.log("Inventory form Data", { formData });
  const { data: currentUser } = useQueryCurrentUser();
  const { branch_id: currentUserBranchID } = currentUser ?? {};
  const { type: formType } = formData;

  const queryClient = useQueryClient();
  const { mutate: createInventory, isPending } =
    useMutationAdjustProductInventory();

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Inventory created successfully!"
        : "Inventory updated successfully!"
    );
    queryClient.invalidateQueries({ queryKey: ["get-inventories-query"] });
    onOpenChange();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create Inventory."
        : "Failed to update Inventory.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: InventorySchemaType) => {
    // console.log("🚀 ~ onSubmit ~ Inventory values:", values);
    // return;
    const isCreate = formData.type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    isCreate &&
      createInventory(values, {
        onSuccess: () => onSuccess(action),
        onError: (e) => onError(action, e),
      });
  };
  console.log({ errors });

  return (
    <AppDialog
      open={open}
      title={formData.title || "Inventory"}
      buttonText={formData.buttonText}
      isPending={isPending}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ControlBranchDropdown
            label="Branch"
            name="branch_id"
            errors={errors}
            control={control}
          />
          <ControlProductDropdown
            label="Product"
            name={`product_id`}
            placeholder="Product"
            errors={errors}
            control={control}
            params={{
              type: PRODUCT_TYPE.general,
            }}
          />
        </div>

        <FormNumberInput name="quantity" label="Quantity" control={control} />
      </div>
    </AppDialog>
  );
}
