"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { WastageSchema, WastageSchemaType } from "../_types/wastage_types";
import { GlobalFormType } from "@/types/global";

import { useMutationCreateWastage } from "../_api/mutations/useMutationCreateWastage";
import { useMutationUpdateWastage } from "../_api/mutations/useMutationUpdateWastage";
import { useQueryCurrentUser } from "../../users/_api/queries/useQueryCurrentUser";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BaseSelect from "@/components/base/BaseSelect";
import { useQueryGetAllBranchesDropdown } from "../../branches/_api/queries/useQueryGetAllBranchesDropdown";
import { useQueryGetAllIngredientsDropdown } from "../../ingredients/_ingredients/_api/queries/useQueryGetAllIngredientsDropdown";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useQueryGetAllUnitsDropdown } from "../../units/_api/queries/useQueryGetAllUnitsDropdown";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryGetWastage } from "../_api/queries/useQueryGetWastage";
import { omitEmpty, showErrors } from "@/lib/utils";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;
export default function WastageForm({ id = "", type, onCancel }: TProps) {
  const form = useForm<WastageSchemaType>({
    resolver: zodResolver(WastageSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const productID = watch("product")?.id;

  const queryClient = useQueryClient();
  const { data: currentUser } = useQueryCurrentUser();
  const { branch_id: currentUserBranchID, branch: currentUserBranch } =
    currentUser ?? {};
  useEffect(() => {
    if (currentUserBranchID) {
      setValue("branch", currentUserBranch);
    }
  }, [currentUserBranchID]);
  const { data: branches, isLoading: isLoadingBranches } =
    useQueryGetAllBranchesDropdown({});

  const { data: products, isLoading: isLoadingProducts } =
    useQueryGetAllIngredientsDropdown({
      params: {
        without_batch: "yes",
      },
    });
  const { data: units, isLoading: isLoadingUnits } =
    useQueryGetAllUnitsDropdown({
      enabled: !!productID, // Only fetch when product is selected
      params: { product_id: productID || "" },
    });
  const { data, isLoading: isLoadingWastage } = useQueryGetWastage({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });

  const { mutate: createWastage, isPending } = useMutationCreateWastage();
  const { mutate: updateWastage, isPending: isPendingUpdateWastage } =
    useMutationUpdateWastage();
  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);
      reset(omit);
    }
  }, [data, reset, type]);

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Wastage created successfully!"
        : "Wastage updated successfully!"
    );
    queryClient.invalidateQueries({ queryKey: ["get-wastages-query"] });
    queryClient.invalidateQueries({ queryKey: ["get-wastages-data"] });
    reset();
    onCancel();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create wastage."
        : "Failed to update wastage.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: WastageSchemaType) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    (isCreate ? createWastage : updateWastage)(
      { ...values, id: isCreate ? undefined : id },
      {
        onSuccess: () => onSuccess(action),
        onError: (e) => onError(action, e),
      }
    );
  };
  const isLoading =
    isLoadingBranches ||
    isLoadingProducts ||
    // isLoadingUnits ||
    isLoadingWastage;
  const isSubmitting = isPending || isPendingUpdateWastage;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            control={control}
            name="product"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>

                <FormControl>
                  <BaseSelect
                    placeholder="Select a product"
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
          <FormField
            control={control}
            name={`unit`}
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
                      placeholder={
                        productID ? "Select a unit" : "Select a product first"
                      }
                      options={units ?? []}
                      fieldState={fieldState}
                      value={field.value?.id ? String(field.value.id) : ""}
                      disabled={!productID}
                      onValueChange={(val) => {
                        if (!!val) {
                          const selected = units?.find(
                            (u: { id: string | number; name: string }) =>
                              String(u.id) === val
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
          <FormField
            control={control}
            name={`quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter a short reason" {...field} />
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
