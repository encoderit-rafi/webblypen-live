"use client";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";
// import toast from "react-hot-toast";
import {
  StockTransferSchema,
  StockTransferSchemaType,
} from "../_types/stock_transfer_types";
import { GlobalFormType } from "@/types/global";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useMutationCreateStockTransfer } from "../_api/mutations/useMutationCreateStockTransfer";
import { useMutationUpdateStockTransfer } from "../_api/mutations/useMutationUpdateStockTransfer";
import { EMPTY_OPTIONS_DATA, PRODUCT_TYPE } from "@/data/global_data";

import { useQueryCurrentUser } from "@/app/(app)/users/_api/queries/useQueryCurrentUser";
import { useQueryGetStockTransfer } from "../_api/queries/useQueryGetStockTransfer";
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
import BaseSelect from "@/components/base/BaseSelect";
import BaseDatePicker from "@/components/base/BaseDatePicker";
import { format } from "date-fns";
import AppTable from "@/components/base/AppTable";
import { Input } from "@/components/ui/input";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { omitEmpty, showErrors } from "@/lib/utils";

type TProps = {
  onCancel: () => void;
} & GlobalFormType & { active_tab: "stock_in" | "stock_out" };
// Product Cell Component
function ProductCell({ index, control, products, loading }: any) {
  return (
    <FormField
      control={control}
      name={`transfer_items.${index}.product`}
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
                options={products || []}
                fieldState={fieldState}
                value={field.value?.id ? String(field.value.id) : ""}
                onValueChange={(val) => {
                  if (!!val) {
                    const selected = products.find(
                      (b: { id: string | number; name: string }) =>
                        String(b.id) === val
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

// Unit Cell Component
function UnitCell({ index, control, productID }: any) {
  const { data: units, isLoading } = useQueryGetAllUnitsDropdown({
    enabled: !!productID,
    params: { product_id: productID || "" },
  });

  return (
    <FormField
      control={control}
      name={`transfer_items.${index}.unit`}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            {isLoading ? (
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

// Quantity Cell Component
function QuantityCell({ index, control }: any) {
  return (
    <FormField
      control={control}
      name={`transfer_items.${index}.request_quantity`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter quantity"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? 0 : Number(e.target.value)
                )
              }
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
  const unitConv =
    useWatch({
      control,
      name: `transfer_items.${index}.unit.conversion_factor`,
    }) || 1;
  const defaultPrice =
    useWatch({
      control,
      name: `transfer_items.${index}.product.default_unit_price`,
    }) || 0;
  const price = Number(defaultPrice) * Number(unitConv);
  return <span>{price.toFixed(2)}</span>;
}

// VAT Cell Component
function VATCell({ index, control }: any) {
  const vat =
    useWatch({ control, name: `transfer_items.${index}.product.vat` }) || 0;
  return <span>{vat}%</span>;
}

// Total Price Cell Component
// function TotalPriceCell({ index, control, type }: any) {
//   const quantityField =
//     type === "update"
//       ? useWatch({
//           control,
//           name: `transfer_items.${index}.receive_quantity`,
//         }) || 0
//       : useWatch({
//           control,
//           name: `transfer_items.${index}.request_quantity`,
//         }) || 0;

//   const unitConv =
//     useWatch({
//       control,
//       name: `transfer_items.${index}.unit.conversion_factor`,
//     }) || 1;
//   const defaultPrice =
//     useWatch({
//       control,
//       name: `transfer_items.${index}.product.default_unit_price`,
//     }) || 0;
//   const total = Number(defaultPrice) * Number(unitConv) * Number(quantityField);

//   return <span>{total.toFixed(2)}</span>;
// }
function TotalPriceCell({ index, control, type }: any) {
  // Call hooks unconditionally
  const receiveQuantity =
    useWatch({
      control,
      name: `transfer_items.${index}.receive_quantity`,
    }) || 0;

  const requestQuantity =
    useWatch({
      control,
      name: `transfer_items.${index}.request_quantity`,
    }) || 0;

  const unitConv =
    useWatch({
      control,
      name: `transfer_items.${index}.unit.conversion_factor`,
    }) || 1;

  const defaultPrice =
    useWatch({
      control,
      name: `transfer_items.${index}.product.default_unit_price`,
    }) || 0;

  // Choose quantity based on type
  const quantityField = type === "update" ? receiveQuantity : requestQuantity;

  const total = Number(defaultPrice) * Number(unitConv) * Number(quantityField);

  return <span>{total.toFixed(2)}</span>;
}

export default function StockTransferForm({
  id = "",
  type,
  active_tab,
  onCancel,
}: TProps) {
  const form = useForm<StockTransferSchemaType>({
    resolver: zodResolver(StockTransferSchema),
  });
  const { data, isLoading: isLoadingStockTransfer } = useQueryGetStockTransfer({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });
  const { data: branches, isLoading: isLoadingBranches } =
    useQueryGetAllBranchesDropdown({});

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const { data: products, isLoading: isLoadingProducts } =
    useQueryGetAllIngredientsDropdown({
      params: {
        type: PRODUCT_TYPE.general,
        inventory_branch_id: watch("from_branch")?.id,
      },
    });
  console.log("👉 ~ StockTransferForm ~ errors:", errors);
  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);

      reset(omit);
    }
  }, [data, reset, type]);
  const { data: currentUser } = useQueryCurrentUser();
  const { branch_id: currentUserBranchID, branch: currentUserBranch } =
    currentUser ?? {};

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "transfer_items",
  });

  const { mutate: createStockTransfer, isPending } =
    useMutationCreateStockTransfer();
  const {
    mutate: updateStockTransfer,
    isPending: isPendingUpdateStockTransfer,
  } = useMutationUpdateStockTransfer();

  const queryClient = useQueryClient();
  useEffect(() => {
    if (currentUserBranchID) {
      active_tab == "stock_in"
        ? setValue("to_branch", currentUserBranch)
        : setValue("from_branch", currentUserBranch);
    }
  }, [currentUserBranchID]);

  const columns = useMemo(
    () => [
      {
        header: "Product",
        accessorKey: "product",
        cell: ({ row }: any) => {
          const index = row.index;
          return (
            <ProductCell
              index={index}
              control={control}
              products={products}
              loading={isLoadingProducts}
            />
          );
        },
      },
      {
        header: "Request Quantity",
        accessorKey: "request_quantity",
        cell: ({ row }: any) => {
          const index = row.index;
          return <QuantityCell index={index} control={control} />;
        },
      },
      ...(type === "update"
        ? [
            {
              header: "Receive Quantity",
              accessorKey: "receive_quantity",
              cell: ({ row }: any) => {
                const index = row.index;
                return (
                  <FormField
                    control={control}
                    name={`transfer_items.${index}.receive_quantity`}
                    render={({ field }) => (
                      <FormItem>
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
                );
              },
            },
          ]
        : []),
      {
        header: "UOM",
        accessorKey: "unit",
        cell: ({ row }: any) => {
          const index = row.index;
          const product = watch(`transfer_items.${index}.product`);
          const productID = product?.id;
          return (
            <UnitCell index={index} control={control} productID={productID} />
          );
        },
      },
      {
        header: "VAT Amount",
        accessorKey: "vat",
        cell: ({ row }: any) => {
          const index = row.index;
          return <VATCell index={index} control={control} />;
        },
      },
      {
        header: "Unit Price",
        accessorKey: "unit_price",
        cell: ({ row }: any) => {
          const index = row.index;
          return <UnitPriceCell index={index} control={control} />;
        },
      },
      {
        header: "Total Price",
        accessorKey: "total_price",
        cell: ({ row }: any) => {
          const index = row.index;
          return <TotalPriceCell index={index} control={control} type={type} />;
        },
      },
      {
        header: "Action",
        id: "actions",
        cell: ({ row }: any) => {
          const index = row.index;
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
        },
      },
    ],
    [control, products, fields.length, watch, remove, isLoadingProducts, type]
  );

  const isLoading = isLoadingStockTransfer || isLoadingBranches;
  const isSubmitting = isPending || isPendingUpdateStockTransfer;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <Spinner variant="bars" />
      </div>
    );
  }
  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "Stock transfer is created successfully!"
        : "Stock transfer is updated successfully!";
    queryClient.invalidateQueries({
      queryKey: ["get-stock-transfers-query"],
    });
    queryClient.invalidateQueries({
      queryKey: ["get-stock-transfer-query"],
    });
    toast.success(message);
    reset();
    onCancel();
  };
  const onError = (type: "create" | "update", error: Error) => {
    console.log("👉 ~ onError ~ error:", error);
    const fallback =
      type === "create"
        ? "Failed to create Stock transfer."
        : "Failed to update Stock transfer.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: StockTransferSchemaType) => {
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";
    (isCreate ? createStockTransfer : updateStockTransfer)(values, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {(!Boolean(currentUserBranchID) || active_tab == "stock_in") && (
            <FormField
              control={form.control}
              name="from_branch"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>From Branch</FormLabel>
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
              )}
            />
          )}
          {(!Boolean(currentUserBranchID) || active_tab == "stock_out") && (
            <FormField
              control={form.control}
              name="to_branch"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>To Branch</FormLabel>
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
              )}
            />
          )}

          <FormField
            control={control}
            name="expected_delivery_date"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Purchase Date</FormLabel>
                <FormControl>
                  <BaseDatePicker
                    placeholder="Expected delivery date"
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
        </div>

        <Button
          type="button"
          variant={"outline"}
          onClick={() =>
            prepend({
              product: EMPTY_OPTIONS_DATA,
              unit: EMPTY_OPTIONS_DATA,
              request_quantity: 0,
              receive_quantity: 0,
            })
          }
        >
          <Plus />
          Add Products
        </Button>

        <AppTable
          data={fields ?? []}
          columns={columns}
          footer={
            <TableFooter className="bg-transparent">
              <TableRow>
                <TableCell
                  colSpan={type == "update" ? 6 : 5}
                  className="text-end"
                >
                  {type === "update" ? "Received Total" : "Requested Total"}
                </TableCell>
                <TableCell colSpan={2}>
                  {(watch("transfer_items") || []).reduce((sum, item) => {
                    const quantity =
                      type === "update"
                        ? Number(item?.receive_quantity) || 0
                        : Number(item?.request_quantity) || 0;

                    return (
                      sum +
                      Number(item?.product?.default_unit_price || 0) *
                        Number(item?.unit?.conversion_factor || 1) *
                        quantity
                    );
                  }, 0)}
                </TableCell>
              </TableRow>
            </TableFooter>
          }
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
