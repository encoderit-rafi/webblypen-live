"use client";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { GlobalFormType } from "@/types/global";
import { EMPTY_UNIT_DATA, PRODUCT_TYPE } from "@/data/global_data";

import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

import {
  InventoryDailyTrackSchema,
  InventoryDailyTrackSchemaType,
} from "../_types/inventory_types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useMutationCreateKeyItem } from "../_api/mutations/useMutationCreateKeyItem";
import { useMutationUpdateKeyItem } from "../_api/mutations/useMutationUpdateKeyItem";
import { useQueryGetKeyItem } from "../_api/queries/useQueryGetKeyItem";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useQueryCurrentUser } from "@/app/(app)/users/_api/queries/useQueryCurrentUser";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BaseSelect from "@/components/base/BaseSelect";
import { useQueryGetAllBranchesDropdown } from "@/app/(app)/branches/_api/queries/useQueryGetAllBranchesDropdown";
import { useQueryGetAllIngredientsDropdown } from "@/app/(app)/ingredients/_ingredients/_api/queries/useQueryGetAllIngredientsDropdown";
import { useQueryGetAllUnitsDropdown } from "@/app/(app)/units/_api/queries/useQueryGetAllUnitsDropdown";
import AppTable from "@/components/base/AppTable";
import { omitEmpty, showErrors } from "@/lib/utils";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;
// ProductCell.tsx
export function ProductCell({ index, control, detailsProducts }: any) {
  return (
    <FormField
      control={control}
      name={`details.${index}.product`}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <BaseSelect
              placeholder="Select a ingredient"
              options={detailsProducts}
              fieldState={fieldState}
              value={field.value?.id ? String(field.value.id) : ""}
              onValueChange={(val) => {
                if (!val) return;
                const selected = detailsProducts.find(
                  (b: any) => String(b.id) === val
                );
                field.onChange(selected);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
// InQuantityCell.tsx
export function InQuantityCell({ index, control }: any) {
  return (
    <FormField
      control={control}
      name={`details.${index}.total_in_quantity`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type="number" placeholder="Enter quantity" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
// UnitCell.tsx
export function UnitCell({ index, watch }: any) {
  const unit = watch(`details.${index}.product`)?.default_unit?.name ?? "";
  return <Input disabled value={unit} />;
}
// SizeCell.tsx
export function SizeCell({ index, control }: any) {
  return (
    <FormField
      control={control}
      name={`details.${index}.out_quantity_per_unit`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type="number" placeholder="Enter size" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
// SizeUOMCell.tsx
export function SizeUOMCell({ index, control, units }: any) {
  return (
    <FormField
      control={control}
      name={`details.${index}.out_ingredient_unit`}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <BaseSelect
              placeholder="Select a unit"
              options={units}
              fieldState={fieldState}
              value={field.value?.id ? String(field.value.id) : ""}
              onValueChange={(val) => {
                if (!val) return;
                const selected = units.find((b: any) => String(b.id) === val);
                field.onChange(selected);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
// TotalOutQuantityCell.tsx
export function TotalOutQuantityCell({ index, watch }: any) {
  return (
    <Input
      disabled
      value={watch(`details.${index}.total_out_quantity`) ?? ""}
    />
  );
}
// CostPriceCell.tsx
export function CostPriceCell({ index, watch }: any) {
  return <Input disabled value={watch(`details.${index}.cost_price`) ?? ""} />;
}
// ActionCell.tsx
export function ActionCell({ index, remove }: any) {
  return (
    <Button
      type="button"
      variant="destructive"
      className="w-full"
      onClick={() => remove(index)}
    >
      <Trash2 />
    </Button>
  );
}

export default function InventoryItemForm({ id = "", type, onCancel }: TProps) {
  const form = useForm<InventoryDailyTrackSchemaType>({
    resolver: zodResolver(InventoryDailyTrackSchema),
  });
  const { control, handleSubmit, reset, watch, setValue, getValues } = form;
  const ingredient = watch("ingredient");
  const recovery_rate = watch("recovery_rate");
  const total_out_quantity = watch("total_out_quantity");
  const ideal_recovery_rate = watch("ideal_recovery_rate");
  const ingredient_unit = useWatch({ control, name: "ingredient_unit" });
  const details = useWatch({ control, name: "details" });
  const { data, isLoading: isLoadingKeyItem } = useQueryGetKeyItem({
    enabled: type == "update" && !!id,
    id,
  });
  // useEffect(() => {
  //   if (ingredient) {
  //     setValue("details", []);
  //   }
  // }, [ingredient]);
  const { data: branches, isLoading: isLoadingBranches } =
    useQueryGetAllBranchesDropdown({});
  const { data: units, isLoading: isLoadingUnits } =
    useQueryGetAllUnitsDropdown({
      params: {
        product_id: ingredient?.id,
      },
    });
  const { data: products, isLoading: isLoadingProducts } =
    useQueryGetAllIngredientsDropdown({
      params: {
        type: PRODUCT_TYPE.general,
        inventory_branch_id: watch("branch")?.id,
        is_useable_for_item: 1,
      },
    });
  const { data: detailsProducts, isLoading: isLoadingDetailsProducts } =
    useQueryGetAllIngredientsDropdown({
      params: {
        item_type: "key",
      },
    });
  const queryClient = useQueryClient();
  const { mutate: createKeyItem, isPending: isPendingCreate } =
    useMutationCreateKeyItem();
  const { mutate: updateKeyItem, isPending: isPendingUpdate } =
    useMutationUpdateKeyItem();

  useEffect(() => {
    if (type === "update" && data) {
      // reset(formatInventoryData(data));
      console.log("👉 ~ InventoryItemForm ~ data:", data);
      const omit = omitEmpty(data);

      reset({
        ...omit,

        ingredient_unit: data.unit,
        ingredient: {
          ...data.ingredient,
          ideal_recovery_rate: data.ideal_recovery_rate,
        },

        details:
          (data.details || []).map((item: any) => ({
            ...item,
            product: {
              ...item.product,
              default_unit: item.product.default_unit ?? item.unit,
            },
          })) || [],
      });
    }
  }, [data, reset, type]);
  const { data: currentUser } = useQueryCurrentUser();
  const { branch_id: currentUserBranchID, branch: currentUserBranch } =
    currentUser ?? {};
  useEffect(() => {
    if (currentUserBranchID) {
      setValue("branch", currentUserBranch);
    }
  }, [currentUserBranchID]);
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "details",
  });

  // ✅ Submit handler
  const onSuccess = (type: "create" | "update") => {
    const msg =
      type === "create"
        ? "Inventory created successfully!"
        : "Inventory updated successfully!";
    toast.success(msg);
    queryClient.invalidateQueries({ queryKey: ["get-daily-key-items-query"] });
    queryClient.invalidateQueries({ queryKey: ["get-daily-key-item-query"] });
    reset();
    onCancel();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create inventory."
        : "Failed to update inventory.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };
  const onSubmit = (values: InventoryDailyTrackSchemaType) => {
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    if (isCreate) {
      createKeyItem(values, {
        onSuccess: () => onSuccess(action),
        onError: (err) => onError(action, err),
      });
    } else {
      updateKeyItem(values, {
        onSuccess: () => onSuccess(action),
        onError: (err) => onError(action, err),
      });
    }
  };

  useEffect(() => {
    if (!!ingredient) {
      setValue("ideal_recovery_rate", ingredient?.ideal_recovery_rate ?? 0);
    }
  }, [ingredient]);

  useEffect(() => {
    const recovery = Number(recovery_rate || 0);
    const ideal = Number(ideal_recovery_rate || 0);
    const variance = ideal > 0 ? recovery / ideal - 1 : 0;
    if (getValues("variance") !== variance) {
      setValue("variance", variance, { shouldDirty: true });
    }
  }, [recovery_rate, ideal_recovery_rate]);

  useEffect(() => {
    let totalRecovered = 0;
    const currentRate = Number(recovery_rate || 0);
    const conversion_factor = Number(ingredient_unit?.conversion_factor) || 1;

    if (details?.length > 0) {
      totalRecovered = details.reduce((sum, item) => {
        const detailQty = Number(item.total_out_quantity || 0);
        return (
          sum + detailQty * +(item.out_ingredient_unit?.conversion_factor || 1)
        );
      }, 0);
    }

    const denominator = +total_out_quantity * conversion_factor;

    // ✅ Prevent division by zero
    const recoveryRate =
      denominator > 0 ? (totalRecovered / denominator) * 100 : 0;

    if (Number.isFinite(recoveryRate) && currentRate !== recoveryRate) {
      setValue("recovery_rate", Number(recoveryRate), {
        shouldDirty: true,
      });
    }
  }, [
    JSON.stringify(ingredient_unit),
    JSON.stringify(details),
    total_out_quantity,
  ]);
  useEffect(() => {
    if (!details) return;
    details.forEach((item: any, index: number) => {
      const totalIn = Number(item.total_in_quantity || 0);
      const perUnit = Number(item.out_quantity_per_unit || 0);
      const calculatedTotalOut = totalIn * perUnit;
      const selectedUnit = item.out_ingredient_unit;
      const calculatedCostPrice =
        +(ingredient?.default_unit_price || 0) *
        +(selectedUnit?.conversion_factor || 0) *
        calculatedTotalOut;

      const currentTotalOut = Number(
        getValues(`details.${index}.total_out_quantity`) ?? 0
      );
      const currentCostPrice = Number(
        getValues(`details.${index}.cost_price`) ?? 0
      );
      if (+currentTotalOut != +calculatedTotalOut) {
        setValue(`details.${index}.total_out_quantity`, calculatedTotalOut, {
          shouldDirty: true,
        });
      }
      if (ingredient && currentCostPrice !== calculatedCostPrice) {
        setValue(`details.${index}.cost_price`, calculatedCostPrice, {
          shouldDirty: true,
        });
      }
      console.log("CALCULATION", {
        total_out_quantity: { currentTotalOut, calculatedTotalOut },
        cost_price: { currentCostPrice, calculatedCostPrice },
      });
    });
  }, [JSON.stringify(details)]);
  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  // Memoize columns with fields.length as dependency
  const columns = useMemo(
    () => [
      {
        header: "Product",
        accessorKey: "product",
        cell: ({ row }: any) => (
          <ProductCell
            index={row.index}
            control={form.control}
            detailsProducts={detailsProducts}
          />
        ),
      },
      {
        header: "In Quantity",
        accessorKey: "in_quantity",
        cell: ({ row }: any) => (
          <InQuantityCell index={row.index} control={control} />
        ),
      },
      {
        header: "UOM",
        accessorKey: "unit",
        cell: ({ row }: any) => <UnitCell index={row.index} watch={watch} />,
      },
      {
        header: "Size",
        accessorKey: "size",
        cell: ({ row }: any) => (
          <SizeCell index={row.index} control={control} />
        ),
      },
      {
        header: "Size UOM",
        accessorKey: "size_uom",
        cell: ({ row }: any) => (
          <SizeUOMCell index={row.index} control={form.control} units={units} />
        ),
      },
      {
        header: "Total out quantity",
        accessorKey: "total_out_quantity",
        cell: ({ row }: any) => (
          <TotalOutQuantityCell index={row.index} watch={watch} />
        ),
        size: 50,
      },
      {
        header: "Cost Price",
        accessorKey: "cost_price",
        cell: ({ row }: any) => (
          <CostPriceCell index={row.index} watch={watch} />
        ),
        size: 50,
      },
      {
        header: "Action",
        id: "actions",
        cell: ({ row }: any) => (
          <ActionCell index={row.index} remove={handleRemove} />
        ),
      },
    ],
    [control, form, watch, detailsProducts, units, handleRemove, fields.length]
  );

  const isLoading =
    isLoadingKeyItem ||
    // isLoadingUnits ||
    // isLoadingProducts ||
    isLoadingDetailsProducts ||
    isLoadingBranches;
  const isSubmitting = isPendingCreate || isPendingUpdate;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <Spinner variant="bars" />
      </div>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Branch & Product */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {!Boolean(currentUserBranchID) && (
            <FormField
              control={form.control}
              name="branch"
              render={({ field, fieldState }) =>
                isLoadingBranches ? (
                  <div className="flex items-center min-w-20 justify-center">
                    <Spinner variant="bars" />
                  </div>
                ) : (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <FormControl>
                      <BaseSelect
                        placeholder="Select a branch"
                        options={branches || []}
                        fieldState={fieldState}
                        value={field.value?.id ? String(field.value.id) : ""}
                        onValueChange={(val) => {
                          if (!!val) {
                            const selected = branches.find(
                              (b: { id: string | number; name: string }) =>
                                String(b.id) == val
                            );
                            field.onChange(selected);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }
            />
          )}

          <FormField
            control={form.control}
            name="ingredient"
            render={({ field, fieldState }) =>
              isLoadingProducts ? (
                <div className="flex items-center min-w-20 justify-center">
                  <Spinner variant="bars" />
                </div>
              ) : (
                <FormItem>
                  <FormLabel>Ingredient</FormLabel>
                  <FormControl>
                    {isLoadingProducts ? (
                      <div className="flex items-center min-w-20 justify-center">
                        <Spinner variant="bars" />
                      </div>
                    ) : (
                      <BaseSelect
                        placeholder="Select a ingredient"
                        options={products || []}
                        fieldState={fieldState}
                        value={field.value?.id ? String(field.value.id) : ""}
                        onValueChange={(val) => {
                          if (!!val) {
                            const selected = products.find(
                              (b: { id: string | number; name: string }) =>
                                String(b.id) == val
                            );
                            field.onChange(selected);
                          }
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }
          />

          <FormField
            control={control}
            name="total_out_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Out Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter out quantity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ingredient_unit"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  {isLoadingUnits ? (
                    <div className="flex items-center min-w-20 justify-center">
                      <Spinner variant="bars" />
                    </div>
                  ) : (
                    <BaseSelect
                      placeholder="Select a unit"
                      options={units || []}
                      fieldState={fieldState}
                      value={field.value?.id ? String(field.value.id) : ""}
                      onValueChange={(val) => {
                        if (!!val) {
                          const selected = units.find(
                            (b: { id: string | number; name: string }) =>
                              String(b.id) == val
                          );
                          field.onChange(selected);
                        }
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-1.5">
            <Label>Ideal Recovery Rate (%)</Label>
            <Input disabled value={watch("ideal_recovery_rate") ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label>Recovery Rate (%)</Label>
            <Input disabled value={watch("recovery_rate") ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label>Variance</Label>
            <Input disabled value={watch("variance") ?? ""} />
          </div>
          <FormField
            control={control}
            name="adjusted_variance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adjusted Variance</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter adjusted variance"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Add Products Button */}
        <div className="flex items-center pb-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              prepend({
                product: {
                  id: "",
                  name: "",
                  default_unit: {
                    id: "",
                    name: "",
                  },
                  default_unit_price: "",
                },
                out_quantity_per_unit: 0,
                out_ingredient_unit: EMPTY_UNIT_DATA,
                total_out_quantity: 0,
                total_in_quantity: 0,
                cost_price: 0,
              })
            }
          >
            <Plus /> Add Products
          </Button>
        </div>

        {/* Products Table */}
        <AppTable
          data={fields ?? []}
          // columns={[
          //   {
          //     // header: "Product",
          //     header: "Product",
          //     accessorKey: "product",
          //     cell: ({ row }) => {
          //       const index = row.index;

          //       return (
          //         <FormField
          //           control={form.control}
          //           name={`details.${index}.product`}
          //           render={({ field, fieldState }) => (
          //             <FormItem>
          //               <FormControl>
          //                 <BaseSelect
          //                   placeholder="Select a ingredient"
          //                   options={detailsProducts}
          //                   fieldState={fieldState}
          //                   value={
          //                     field.value?.id ? String(field.value.id) : ""
          //                   }
          //                   onValueChange={(val) => {
          //                     if (!!val) {
          //                       const selected = detailsProducts.find(
          //                         (b: { id: string | number; name: string }) =>
          //                           String(b.id) == val
          //                       );
          //                       field.onChange(selected);
          //                     }
          //                   }}
          //                 />
          //               </FormControl>
          //               <FormMessage />
          //             </FormItem>
          //           )}
          //         />
          //       );
          //     },
          //   },
          //   {
          //     header: "In Quantity",
          //     accessorKey: "in_quantity",
          //     cell: ({ row }) => {
          //       const index = row.index;
          //       return (
          //         <FormField
          //           control={control}
          //           name={`details.${index}.total_in_quantity`}
          //           render={({ field }) => (
          //             <FormItem>
          //               {/* <FormLabel>Quantity</FormLabel> */}
          //               <FormControl>
          //                 <Input
          //                   type="number"
          //                   placeholder="Enter quantity"
          //                   {...field}
          //                 />
          //               </FormControl>
          //               <FormMessage />
          //             </FormItem>
          //           )}
          //         />
          //       );
          //     },
          //   },
          //   {
          //     header: "UOM",
          //     accessorKey: "unit",
          //     cell: ({ row }) => {
          //       const index = row.index;
          //       return (
          //         <Input
          //           disabled
          //           value={
          //             watch(`details.${index}.product`)?.default_unit?.name ||
          //             ""
          //           }
          //         />
          //       );
          //     },
          //   },
          //   {
          //     header: "Size",
          //     accessorKey: "size",
          //     cell: ({ row }) => {
          //       const index = row.index;
          //       return (
          //         <FormField
          //           control={control}
          //           name={`details.${index}.out_quantity_per_unit`}
          //           render={({ field }) => (
          //             <FormItem>
          //               {/* <FormLabel>Quantity</FormLabel> */}
          //               <FormControl>
          //                 <Input
          //                   type="number"
          //                   placeholder="Enter size"
          //                   {...field}
          //                 />
          //               </FormControl>
          //               <FormMessage />
          //             </FormItem>
          //           )}
          //         />
          //       );
          //     },
          //   },
          //   {
          //     header: "Size UOM",
          //     accessorKey: "size_uom",
          //     cell: ({ row }) => {
          //       const index = row.index;
          //       return (
          //         <FormField
          //           control={form.control}
          //           name={`details.${index}.out_ingredient_unit`}
          //           render={({ field, fieldState }) => (
          //             <FormItem>
          //               <FormControl>
          //                 <BaseSelect
          //                   placeholder="Select a unit"
          //                   options={units}
          //                   fieldState={fieldState}
          //                   value={
          //                     field.value?.id ? String(field.value.id) : ""
          //                   }
          //                   onValueChange={(val) => {
          //                     if (!!val) {
          //                       const selected = units.find(
          //                         (b: { id: string | number; name: string }) =>
          //                           String(b.id) == val
          //                       );
          //                       field.onChange(selected);
          //                     }
          //                   }}
          //                 />
          //               </FormControl>
          //               <FormMessage />
          //             </FormItem>
          //           )}
          //         />
          //       );
          //     },
          //   },
          //   {
          //     header: "Total out quantity",
          //     accessorKey: "total_out_quantity",
          //     cell: ({ row }) => {
          //       const index = row.index;
          //       return (
          //         <Input
          //           disabled
          //           value={watch(`details.${index}.total_out_quantity`) ?? ""}
          //         />
          //       );
          //     },
          //   },
          //   {
          //     header: "Cost Price",
          //     accessorKey: "cost_price",
          //     cell: ({ row }) => {
          //       const index = row.index;
          //       return (
          //         <Input
          //           disabled
          //           value={watch(`details.${index}.cost_price`) ?? ""}
          //         />
          //       );
          //     },
          //   },
          //   {
          //     header: "Action",
          //     id: "actions",
          //     cell: ({ row }) => {
          //       const index = row.index;
          //       return (
          //         <Button
          //           type="button"
          //           variant="destructive"
          //           className="w-full"
          //           onClick={() => remove(index)}
          //         >
          //           <Trash2 />
          //         </Button>
          //       );
          //     },
          //   },
          // ]}
          columns={columns}
        />
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="min-w-24"
            onClick={() => {
              reset();
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} className="min-w-24">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
