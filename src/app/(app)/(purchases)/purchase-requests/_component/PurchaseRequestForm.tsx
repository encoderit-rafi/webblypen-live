"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo } from "react";
import {
  PurchaseRequestSchema,
  PurchaseRequestSchemaType,
} from "../_types/purchase_request_types";
import { GlobalFormType } from "@/types/global";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useMutationCreatePurchaseRequest } from "../_api/mutations/useMutationCreatePurchaseRequest";
import { useMutationUpdatePurchaseRequest } from "../_api/mutations/useMutationUpdatePurchaseRequest";
import { useQueryCurrentUser } from "@/app/(app)/users/_api/queries/useQueryCurrentUser";
import { PRODUCT_TYPE } from "@/data/global_data";

import AppTable from "@/components/base/AppTable";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { useQueryGetPurchaseRequest } from "../_api/queries/useQueryGetPurchaseRequest";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
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
import { useQueryGetAllSuppliersDropdown } from "@/app/(app)/suppliers/_api/queries/useQueryGetAllSuppliersDropdown";
import { useQueryGetAllIngredientsDropdown } from "@/app/(app)/ingredients/_ingredients/_api/queries/useQueryGetAllIngredientsDropdown";
import BaseDatePicker from "@/components/base/BaseDatePicker";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useQueryGetAllUnitsDropdown } from "@/app/(app)/units/_api/queries/useQueryGetAllUnitsDropdown";
import { Input } from "@/components/ui/input";
import { omitEmpty, showErrors } from "@/lib/utils";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;
// Move UnitCell outside and use useWatch
function UnitCell({ index, control }: any) {
  const product = useWatch({
    control,
    name: `purchase_request_items.${index}.product`,
  });
  const productID = product?.id;
  const { data: units, isLoading: isLoadingUnits } =
    useQueryGetAllUnitsDropdown({
      enabled: !!productID,
      params: { product_id: productID || "" },
    });
  return (
    <FormField
      control={control}
      name={`purchase_request_items.${index}.unit`}
      render={({ field, fieldState }) => (
        <FormItem>
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
                  const selected = units?.find(
                    (u: any) => String(u.id) === val
                  );
                  field.onChange(selected);
                }}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Product Cell Component
function ProductCell({ index, control, products, loading }: any) {
  return (
    <FormField
      control={control}
      name={`purchase_request_items.${index}.product`}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            {loading ? (
              <div className="flex items-center min-w-20 justify-center">
                <Spinner variant="bars" />
              </div>
            ) : (
              <BaseSelect
                placeholder="Select a product"
                options={products || [{ id: "", name: "" }]}
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
      )}
    />
  );
}
// Quantity Cell Component
function QuantityCell({ index, control }: any) {
  return (
    <FormField
      control={control}
      name={`purchase_request_items.${index}.quantity`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter quantity"
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === "" ? 0 : Number(value));
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
// Unit Price Cell Component
function UnitPriceCell({ index, control }: any) {
  const unitConv = useWatch({
    control,
    name: `purchase_request_items.${index}.unit.conversion_factor`,
  });
  const defaultPrice = useWatch({
    control,
    name: `purchase_request_items.${index}.product.default_unit_price`,
  });
  const price = Number(defaultPrice || 0) * Number(unitConv || 1);
  return <span>{price.toFixed(2)}</span>;
}
// VAT Cell Component
function VATCell({ index, control }: any) {
  const vat = useWatch({
    control,
    name: `purchase_request_items.${index}.product.vat`,
  });
  return <span>{vat || 0}%</span>;
}
// Total Price Cell Component
function TotalPriceCell({ index, control }: any) {
  const quantity = useWatch({
    control,
    name: `purchase_request_items.${index}.quantity`,
  });
  const unitConv = useWatch({
    control,
    name: `purchase_request_items.${index}.unit.conversion_factor`,
  });
  const defaultPrice = useWatch({
    control,
    name: `purchase_request_items.${index}.product.default_unit_price`,
  });
  const total =
    Number(defaultPrice || 0) * Number(unitConv || 1) * Number(quantity || 0);
  return <span>{total.toFixed(2)}</span>;
}

export default function PurchaseRequestForm({
  id = "",
  type,
  onCancel,
}: TProps) {
  const form = useForm<PurchaseRequestSchemaType>({
    resolver: zodResolver(PurchaseRequestSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    // formState: { errors },
  } = form;
  const selectedSupplierID = watch("supplier")?.id || "";
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
  const { data: suppliers, isLoading: isLoadingSuppliers } =
    useQueryGetAllSuppliersDropdown({});
  const { data: products, isLoading: isLoadingProducts } =
    useQueryGetAllIngredientsDropdown({
      params: {
        type: PRODUCT_TYPE.general,
        supplier_id: selectedSupplierID,
      },
    });
  const { data, isLoading: isLoadingPurchaseRequest } =
    useQueryGetPurchaseRequest({
      enabled: type === "update" && !!id,
      id: id ?? "",
    });

  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);

      reset(omit);
    }
  }, [data, reset, type]);
  const queryClient = useQueryClient();

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "purchase_request_items",
  });

  const { mutate: createPurchaseRequest, isPending } =
    useMutationCreatePurchaseRequest();
  const {
    mutate: updatePurchaseRequest,
    isPending: isPendingUpdatePurchaseRequest,
  } = useMutationUpdatePurchaseRequest();

  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "Purchase request is created successfully!"
        : "Purchase request is updated successfully!";
    queryClient.invalidateQueries({
      queryKey: ["get-purchase-requests-query"],
    });
    queryClient.invalidateQueries({
      queryKey: ["get-purchase-request-data"],
    });
    toast.success(message);
    reset();
    onCancel();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create purchase request."
        : "Failed to update purchase request.";

    showErrors(error, fallback);
  };

  const onSubmit = (values: PurchaseRequestSchemaType) => {
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";
    if (values.purchase_request_items?.length == 0) {
      return toast.error("Select at least 1 product.");
    }
    (isCreate ? createPurchaseRequest : updatePurchaseRequest)(values, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };

  // Memoize remove handler
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
        accessorKey: "product_id",
        cell: ({ row }: any) => (
          <ProductCell
            index={row.index}
            control={control}
            products={products}
            loading={isLoadingProducts}
          />
        ),
      },
      {
        header: "Quantity",
        accessorKey: "quantity",
        cell: ({ row }: any) => (
          <QuantityCell index={row.index} control={control} />
        ),
      },
      {
        header: "UOM",
        accessorKey: "unit",
        cell: ({ row }: any) => (
          <UnitCell index={row.index} control={control} />
        ),
      },
      {
        header: "Unit Price",
        accessorKey: "unit_price",
        cell: ({ row }: any) => (
          <UnitPriceCell index={row.index} control={control} />
        ),
      },
      {
        header: "VAT",
        accessorKey: "vat",
        cell: ({ row }: any) => <VATCell index={row.index} control={control} />,
      },
      {
        header: "Total Price",
        accessorKey: "total_price",
        cell: ({ row }: any) => (
          <TotalPriceCell index={row.index} control={control} />
        ),
      },
      {
        header: "Action",
        id: "actions",
        cell: ({ row }: any) => (
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={() => handleRemove(row.index)}
          >
            <Trash2 />
          </Button>
        ),
      },
    ],
    [control, products, handleRemove, fields.length] // Add fields.length
  );

  const isLoading =
    // isLoadingBranches ||
    // isLoadingSuppliers ||
    // isLoadingProducts ||
    isLoadingPurchaseRequest;
  const isSubmitting = isPending || isPendingUpdatePurchaseRequest;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <Spinner variant="bars" />
      </div>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="space-y-4 w-full">
          {!Boolean(currentUserBranchID) && (
            <FormField
              control={form.control}
              name="branch"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    {isLoadingBranches ? (
                      <div className="flex items-center min-w-20 justify-center">
                        <Spinner variant="bars" />
                      </div>
                    ) : (
                      <BaseSelect
                        placeholder="Select a branch"
                        options={branches || [{ id: "", name: "" }]}
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
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={control}
            name="supplier"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  {isLoadingSuppliers ? (
                    <div className="flex items-center min-w-20 justify-center">
                      <Spinner variant="bars" />
                    </div>
                  ) : (
                    <BaseSelect
                      placeholder="Select a supplier"
                      options={suppliers || [{ id: "", name: "" }]}
                      fieldState={fieldState}
                      value={field.value?.id ? String(field.value.id) : ""}
                      onValueChange={(val) => {
                        if (!!val) {
                          const selected = suppliers.find(
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
          <FormField
            control={control}
            name="expected_delivery_date"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Expected Delivery Date</FormLabel>
                <FormControl>
                  <BaseDatePicker
                    placeholder="Select purchase date"
                    value={field.value}
                    invalid={fieldState.invalid}
                    onSelect={(date: Date) => {
                      if (date) {
                        field.onChange(format(date, "yyyy-MM-dd"));
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

          <div className="flex items-center pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                prepend({
                  product: {
                    id: "",
                    name: "",
                    default_unit_price: 0,
                    vat: 0,
                  },
                  unit: {
                    id: "",
                    name: "",
                    conversion_factor: 0,
                    min_unit_conversion_factor: 0,
                  },
                  quantity: 0,
                })
              }
            >
              <Plus />
              Add Products
            </Button>
          </div>

          <AppTable
            data={fields ?? []}
            columns={columns}
            footer={
              <TableFooter className="bg-transparent">
                <TableRow>
                  <TableCell colSpan={5} className="text-end">
                    Total
                  </TableCell>
                  <TableCell colSpan={2}>
                    {(watch("purchase_request_items") || [])
                      .reduce(
                        (sum, item) =>
                          sum +
                          Number(item?.product?.default_unit_price || 0) *
                            Number(
                              item?.unit?.conversion_factor ||
                                // item?.unit?.min_unit_conversion_factor ||
                                0
                            ) *
                            Number(item?.quantity || 0),
                        0
                      )
                      .toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            }
          />
        </div>
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
