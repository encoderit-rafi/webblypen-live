"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
// import toast from "react-hot-toast";
import {
  InventoryCountFormType,
  InventoryCountSchema,
  InventoryCountSchemaType,
} from "../_types/inventory_count_types";
import { ModalType } from "@/types/global";
import { nanoid } from "nanoid";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import AppDialog from "@/components/base/AppDialog";
import { Plus, Trash2 } from "lucide-react";

// import { useMutationCreateInventoryCount } from "../_api/mutations/useMutationCreateInventoryCount";
// import { useMutationUpdateInventoryCount } from "../_api/mutations/useMutationUpdateInventoryCount";
import { EMPTY_OPTIONS_DATA } from "@/data/global_data";
import { INITIAL_FORM_DATA } from "../_data/data";

import { FormInput } from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import ControlProductDropdown from "@/components/control_dropdowns/ControlProductDropdown";
import ControlUnitDropdown from "@/components/control_dropdowns/ControlUnitDropdown";
// import ControlInventoryCountCategoryDropdown from "@/components/control_dropdowns/ControlInventoryCountCategoriesDropdown";
import { optionFormat } from "@/utils/optionsFormat";
import { useMutationUpdateInventoryCount } from "../_api/mutations/useMutationUpdateInventoryCount";
import { toast } from "sonner";
import { omitEmpty, showErrors } from "@/lib/utils";

type InventoryCountFormProps = ModalType & {
  formData: InventoryCountFormType;
};

export default function InventoryCountForm({
  open,
  onOpenChange,
  formData,
}: InventoryCountFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<InventoryCountSchemaType & {}>({
    resolver: zodResolver(InventoryCountSchema),
    defaultValues: formData.data,
  });

  const { type: formType, data: initialData } = formData;
  console.log("🚀 ~ InventoryCountForm ~ initialData:", initialData);

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "physical_counts",
  });

  // const { mutate: createInventoryCount, isPending } =
  //   useMutationCreateInventoryCount();
  const {
    mutate: updateInventoryCount,
    isPending: isPendingUpdateInventoryCount,
  } = useMutationUpdateInventoryCount();

  const queryClient = useQueryClient();

  // Reset on create/update
  useEffect(() => {
    if (formType === "create") {
      const formattedData = {
        inventory_count_id: initialData.id,
        // physical_counts: initialData.physical_counts,
      };
      console.log("🚀 ~ InventoryCountForm ~ formattedData:", formattedData);
      // const omit = omitEmpty()
      reset(formattedData);
    }
  }, [formData]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) reset(INITIAL_FORM_DATA.data);
  }, [open]);

  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "InventoryCount created successfully!"
        : "InventoryCount updated successfully!";
    queryClient.invalidateQueries({
      queryKey: ["get-inventory-physical-counts-query"],
    });
    toast.success(message);
    onOpenChange();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create recipe."
        : "Failed to update recipe.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   console.log("🚀 ~ onError ~ error:", error);
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: InventoryCountSchemaType) => {
    console.log("🚀 InventoryCount form values:", values);
    const isCreate = formType === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";
    updateInventoryCount(values, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };

  return (
    <AppDialog
      open={open}
      title={formData.title || "InventoryCount"}
      buttonText={formData.buttonText}
      isPending={isPendingUpdateInventoryCount}
      onOpenChange={() => onOpenChange()}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <div className="flex items-center pb-2">
          <Button
            type="button"
            variant={"outline"}
            onClick={() =>
              prepend({
                unit_id: EMPTY_OPTIONS_DATA,
                quantity: 0,
              })
            }
          >
            <Plus />
            Add Count
          </Button>
        </div>

        {/* Table layout for ingredients */}
        <div className="grid grid-cols-3">
          <div className="border p-1">UOM</div>
          <div className="border p-1">Quantity</div>
          <div className="border p-1">Action</div>

          <div className="col-span-full">
            {fields.map((field, index) => {
              const rowErrors = errors.physical_counts?.[index];
              // const productID = watch(
              //   `physical_counts.${index}.product_id`
              // )?.id;

              return (
                <div
                  key={`${field.id}-${index}-${nanoid()}`}
                  className={`grid grid-cols-3 ${
                    rowErrors ? "border-red-500" : "border-muted"
                  }`}
                >
                  <div className="border p-1">
                    <ControlUnitDropdown
                      name={`physical_counts.${index}.unit_id`}
                      placeholder="Select Unit"
                      control={control}
                      errors={errors}
                      params={{
                        product_id: initialData?.product_id,
                      }}
                    />
                  </div>

                  <div className="border p-1">
                    <FormInput
                      type="number"
                      name={`physical_counts.${index}.quantity`}
                      placeholder="Quantity"
                      control={control}
                      errors={errors}
                    />
                  </div>

                  <div className="border p-1">
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full"
                      onClick={() => remove(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppDialog>
  );
}
