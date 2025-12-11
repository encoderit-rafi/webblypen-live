"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import {
  BatchItemSchema,
  BatchItemSchemaType,
} from "../_types/batch_item_types";
import { GlobalFormType, ModalType } from "@/types/global";
import { useQueryClient } from "@tanstack/react-query";
import { omitEmpty, showErrors } from "@/lib/utils";
import { isAxiosError } from "axios";
import AppDialog from "@/components/base/AppDialog";
import { useMutationCreateBatchItem } from "../_api/mutations/useMutationCreateBatchItem";
import { useMutationUpdateBatchItem } from "../_api/mutations/useMutationUpdateBatchItem";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppTable from "@/components/base/AppTable";
import { useQueryGetBatchItem } from "../_api/queries/useQueryGetBatchItem";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQueryGetAllBranchesDropdown } from "@/app/(app)/branches/_api/queries/useQueryGetAllBranchesDropdown";
import { useQueryGetAllUnitsDropdown } from "@/app/(app)/units/_api/queries/useQueryGetAllUnitsDropdown";
import { useQueryGetAllIngredientsDropdown } from "@/app/(app)/ingredients/_ingredients/_api/queries/useQueryGetAllIngredientsDropdown";
import { useQueryCurrentUser } from "@/app/(app)/users/_api/queries/useQueryCurrentUser";
import BaseSelect from "@/components/base/BaseSelect";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;
const columns = [
  {
    header: "Name",
    accessorKey: "product.name",
    cell: (props: any) => props.getValue() as string,
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    cell: (props: any) => props.getValue() as string,
  },
  {
    header: "Unit",
    accessorKey: "unit.code",
    cell: (props: any) => props.getValue() as string,
  },
];
export default function BatchItemForm({ id = "", type, onCancel }: TProps) {
  const form = useForm<BatchItemSchemaType>({
    resolver: zodResolver(BatchItemSchema),
  });
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = form;
  const { data, isLoading: isLoadingBatchItem } = useQueryGetBatchItem({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });
  const { data: branches, isLoading: isLoadingBranches } =
    useQueryGetAllBranchesDropdown({});
  const { data: units, isLoading: isLoadingUnits } =
    useQueryGetAllUnitsDropdown({
      params: {
        product_id: watch("product")?.id,
      },
    });
  const { data: products, isLoading: isLoadingProducts } =
    useQueryGetAllIngredientsDropdown({
      params: {
        item_type: "batch",
      },
    });
  const { data: keys, isLoading: isLoadingKeys } =
    useQueryGetAllIngredientsDropdown({
      params: {
        item_type: "key",
      },
    });
  useEffect(() => {
    if (type === "update" && data) {
      // console.log("👉 ~ BatchItemForm ~ data:", data);
      const omit = omitEmpty(data);
      reset(omit);
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
  const { mutate: createBatchItem, isPending } = useMutationCreateBatchItem();
  const { mutate: updateBatchItem, isPending: isPendingUpdateBatchItem } =
    useMutationUpdateBatchItem();
  const queryClient = useQueryClient();
  const batch_item = watch("batch_item");
  useEffect(() => {
    if (!!batch_item?.default_unit) {
      setValue("batch_unit", batch_item.default_unit);
    }
  }, [batch_item]);

  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "BatchItem is created successfully!"
        : "BatchItem is updated successfully!";
    queryClient.invalidateQueries({
      queryKey: ["get-daily-batch-items-query"],
    });
    queryClient.invalidateQueries({
      queryKey: ["get-daily-batch-item-query"],
    });
    toast.success(message);
    reset();
    onCancel();
  };
  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create ingredient."
        : "Failed to update ingredient.";
    showErrors(error, fallback);
    // if (isAxiosError(error)) {
    //   const data = error.response?.data;

    //   // If backend returns the errors object
    //   if (data?.errors) {
    //     const allMessages = Object.values(data.errors).flat(); // array of strings
    //     console.log("👉 ~ onError ~ allMessages:", allMessages);

    //     allMessages.forEach((msg: any) => {
    //       toast.error(msg); // show each error separately
    //     });

    //     return;
    //   }

    //   // If no errors object, show single message
    //   toast.error(data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
  };

  const onSubmit = (values: BatchItemSchemaType) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    // return;
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    const payload = omitEmpty({
      ...values,
    }) as BatchItemSchemaType;

    (isCreate ? createBatchItem : updateBatchItem)(payload, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };
  const isLoading =
    isLoadingBatchItem ||
    isLoadingProducts ||
    isLoadingUnits ||
    isLoadingBranches ||
    isLoadingKeys;
  const isSubmitting = isPending || isPendingUpdateBatchItem;

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
        {!Boolean(currentUserBranchID) && (
          <FormField
            control={form.control}
            name="branch"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <FormControl>
                  <BaseSelect
                    placeholder="Select a branch"
                    options={branches}
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
            )}
          />
        )}
        <FormField
          control={form.control}
          name="batch_item"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Batch item</FormLabel>
              <FormControl>
                <BaseSelect
                  placeholder="Select a batch item"
                  options={products}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-1.5">
          <Label>Unit</Label>
          <Input value={watch("batch_unit")?.name || ""} disabled />
        </div>
        {!!batch_item?.batch_items && batch_item?.batch_items?.length > 0 && (
          <div className="space-y-1.5">
            <Label>Products</Label>
            <AppTable data={batch_item?.batch_items ?? []} columns={columns} />
          </div>
        )}

        <FormField
          control={control}
          name="batch_out_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Out Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter omp number"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product"
          render={({ field, fieldState }) => {
            return (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <BaseSelect
                    placeholder="Select a product"
                    options={keys}
                    fieldState={fieldState}
                    value={field.value?.id ? String(field.value.id) : ""}
                    onValueChange={(val) => {
                      if (!!val) {
                        const selected = keys.find(
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
            );
          }}
        />

        <FormField
          control={form.control}
          name="unit"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <BaseSelect
                  placeholder="Select a unit"
                  options={units}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="product_in_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product in quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter product in quantity"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter a short note" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
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
//346
