"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo } from "react";
import {
  OpenMarketSchema,
  OpenMarketSchemaType,
} from "../_types/open_market_types";
import { GlobalFormType } from "@/types/global";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationCreateOpenMarket } from "../_api/mutations/useMutationCreateOpenMarket";
import { useMutationUpdateOpenMarket } from "../_api/mutations/useMutationUpdateOpenMarket";
import { useQueryGetOpenMarket } from "../_api/queries/useQueryGetOpenMarket";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useQueryGetAllBranchesDropdown } from "../../branches/_api/queries/useQueryGetAllBranchesDropdown";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BaseSelect from "@/components/base/BaseSelect";
import { useQueryGetAllSuppliersDropdown } from "../../suppliers/_api/queries/useQueryGetAllSuppliersDropdown";
import BaseDatePicker from "@/components/base/BaseDatePicker";
import { format } from "date-fns";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import AppTable from "@/components/base/AppTable";
import { useQueryGetAllIngredientsDropdown } from "../../ingredients/_ingredients/_api/queries/useQueryGetAllIngredientsDropdown";
import { PRODUCT_TYPE } from "@/data/global_data";
import { Plus, Trash2 } from "lucide-react";
import { useQueryGetAllUnitsDropdown } from "../../units/_api/queries/useQueryGetAllUnitsDropdown";
import { toast } from "sonner";
import { useQueryCurrentUser } from "../../users/_api/queries/useQueryCurrentUser";
import { omitEmpty, showErrors } from "@/lib/utils";
function ProductCell({ index, control, products, loading }: any) {
  return (
    <FormField
      control={control}
      name={`items.${index}.product`}
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
                options={products}
                fieldState={fieldState}
                value={field.value?.id ? String(field.value.id) : ""}
                onValueChange={(val) => {
                  const selected = products.find(
                    (p: any) => String(p.id) === val
                  );
                  field.onChange(selected || null);
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
function QuantityCell({ index, control }: any) {
  return (
    <FormField
      control={control}
      name={`items.${index}.quantity`}
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
function UnitCell({ index, control }: any) {
  const product = useWatch({
    control,
    name: `items.${index}.product`,
  });

  const productID = product?.id;

  const { data: units, isLoading } = useQueryGetAllUnitsDropdown({
    enabled: !!productID,
    params: { product_id: productID || "" },
  });

  return (
    <FormField
      control={control}
      name={`items.${index}.unit`}
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
                disabled={!productID}
                value={field.value?.id ? String(field.value.id) : ""}
                onValueChange={(val) => {
                  const selected = units?.find(
                    (u: any) => String(u.id) === val
                  );
                  field.onChange(selected || null);
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
function VATCell({ index, control }: any) {
  const vat = useWatch({
    control,
    name: `items.${index}.product.vat`,
  });

  return <span>{vat ? `${vat}%` : "0%"}</span>;
}
function UnitPriceCell({ index, control }: any) {
  const conversion = useWatch({
    control,
    name: `items.${index}.unit.conversion_factor`,
  });

  const defaultPrice = useWatch({
    control,
    name: `items.${index}.product.default_unit_price`,
  });

  const price = Number(defaultPrice || 0) * Number(conversion || 1);

  return <span>{price.toFixed(2)}</span>;
}
function TotalPriceCell({ index, control }: any) {
  const quantity = useWatch({
    control,
    name: `items.${index}.quantity`,
  });

  const conversion = useWatch({
    control,
    name: `items.${index}.unit.conversion_factor`,
  });

  const defaultPrice = useWatch({
    control,
    name: `items.${index}.product.default_unit_price`,
  });

  const total =
    Number(defaultPrice || 0) * Number(conversion || 1) * Number(quantity || 0);

  return <span>{total.toFixed(2)}</span>;
}

type TProps = {
  onCancel: () => void;
} & GlobalFormType;
export default function OpenMarketForm({ id = "", type, onCancel }: TProps) {
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
        type: PRODUCT_TYPE.general,
      },
    });
  const { data: suppliers, isLoading: isLoadingSuppliers } =
    useQueryGetAllSuppliersDropdown({});
  const { data, isLoading: isLoadingOpenMarket } = useQueryGetOpenMarket({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });

  const form = useForm<OpenMarketSchemaType>({
    resolver: zodResolver(OpenMarketSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    watch,
    // formState: { errors },
  } = form;
  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);

      reset(omit);
    }
  }, [data, reset, type]);

  const queryClient = useQueryClient();
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "items",
  });
  const items = useWatch({ control, name: "items" });

  const { mutate: updateOpenMarket, isPending: isPendingUpdateOpenMarket } =
    useMutationUpdateOpenMarket();

  const { mutate: createOpenMarket, isPending } = useMutationCreateOpenMarket();
  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "Open market is created successfully!"
        : "Open market is updated successfully!";
    queryClient.invalidateQueries({
      queryKey: ["get-open-markets-query"],
    });
    queryClient.invalidateQueries({
      queryKey: ["get-open-market-data"],
    });
    toast.success(message);
    reset();
    onCancel();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create open market."
        : "Failed to update open market.";
    // if (isAxiosError(error)) {
    //   const errorData = error.response?.data?.errors;
    //   if (
    //     !!Object.keys(errorData).length &&
    //     Object.keys(errorData).map((item) => item == "items")
    //   ) {
    //     Object.keys(errorData).forEach((item) => {
    //       const error = item.split(".").slice(0, -1).join(".");
    //       setError(error as any, {
    //         type: "manual",
    //         message: "Product error",
    //       });
    //     });
    //   }
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: OpenMarketSchemaType) => {
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";
    if (values.items?.length == 0) {
      return toast.error("Select at least 1 product.");
    }
    (isCreate ? createOpenMarket : updateOpenMarket)(values, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };
  useEffect(() => {
    if (!items?.length) return;
    items.forEach((item, index) => {
      const quantity = Number(item.quantity || 0);
      const unitConv =
        Number(item.unit?.conversion_factor) ||
        // Number(item.unit?.min_unit_conversion_factor) ||
        1;

      const defaultPrice = Number(item.product?.default_unit_price || 0);
      const unitPrice = defaultPrice * unitConv;
      const totalPrice = unitPrice * quantity;
      const vat =
        item.product?.vat === 0 || item.product?.vat == null
          ? 0
          : (totalPrice / 1.12) * 0.12;

      if (unitPrice !== getValues(`items.${index}.unit_price`)) {
        setValue(`items.${index}.unit_price`, unitPrice, {
          shouldDirty: true,
        });
      }

      if (totalPrice !== getValues(`items.${index}.total_price`)) {
        setValue(`items.${index}.total_price`, totalPrice, {
          shouldDirty: true,
        });
      }

      if (vat !== getValues(`items.${index}.vat`)) {
        setValue(`items.${index}.vat`, vat, { shouldDirty: true });
      }
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.total_price || 0),
      0
    );
    const vatAmount = items.reduce(
      (sum, item) => sum + Number(item.vat || 0),
      0
    );

    if (totalAmount !== getValues("total_amount")) {
      setValue("total_amount", totalAmount, { shouldDirty: true });
    }
    if (vatAmount !== getValues("vat_amount")) {
      setValue("vat_amount", vatAmount, { shouldDirty: true });
    }
  }, [JSON.stringify(items)]);
  // function UnitCell({ index, id }: any) {
  //   // const product = watch(`items.${index}.product`);
  //   // const productID = product?.id;

  //   const { data: units, isLoading: isLoadingUnits } =
  //     useQueryGetAllUnitsDropdown({
  //       enabled: !!id,
  //       params: { product_id: id || "" },
  //     });

  //   return (
  //     <FormField
  //       control={control}
  //       name={`items.${index}.unit`}
  //       render={({ field, fieldState }) => (
  //         <FormItem>
  //           <FormControl>
  //             {isLoadingUnits ? (
  //               <div className="flex items-center min-w-20 justify-center">
  //                 <Spinner variant="bars" />
  //               </div>
  //             ) : (
  //               <BaseSelect
  //                 placeholder={id ? "Select a unit" : "Select a product first"}
  //                 options={units ?? []}
  //                 fieldState={fieldState}
  //                 value={field.value?.id ? String(field.value.id) : ""}
  //                 disabled={!id}
  //                 onValueChange={(val) => {
  //                   const selected = units?.find(
  //                     (u: any) => String(u.id) === val
  //                   );
  //                   field.onChange(selected);
  //                 }}
  //               />
  //             )}
  //           </FormControl>
  //           <FormMessage />
  //         </FormItem>
  //       )}
  //     />
  //   );
  // }
  // Memoize remove handler
  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  // Columns (Converted Version)
  const columns = useMemo(
    () => [
      {
        header: "Product",
        accessorKey: "product",
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
        header: "VAT Amount",
        accessorKey: "vat",
        cell: ({ row }: any) => <VATCell index={row.index} control={control} />,
      },
      {
        header: "Unit Price",
        accessorKey: "unit_price",
        cell: ({ row }: any) => (
          <UnitPriceCell index={row.index} control={control} />
        ),
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
    [control, products, isLoadingProducts, handleRemove, fields.length]
  );

  const isLoading =
    isLoadingBranches ||
    isLoadingSuppliers ||
    isLoadingProducts ||
    isLoadingOpenMarket;
  const isSubmitting = isPending || isPendingUpdateOpenMarket;

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
          name="supplier"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <FormControl>
                <BaseSelect
                  placeholder="Select a supplier"
                  options={suppliers}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="omp_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OMP Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter omp number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="purchase_date"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Purchase Date</FormLabel>
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
                unit_price: 0,
                vat: 0,
                total_price: 0,
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
                  VAT Total
                </TableCell>
                <TableCell colSpan={2}>
                  {Number(watch("vat_amount") || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-end">
                  Total
                </TableCell>
                <TableCell colSpan={2}>
                  {Number(watch("total_amount") || 0).toFixed(2)}
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
