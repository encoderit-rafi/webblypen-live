"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
// import toast from "react-hot-toast";
import { ItemSchema, ItemSchemaType } from "../_types/item_types";
import { GlobalFormType } from "@/types/global";
import { useQueryClient } from "@tanstack/react-query";
import { omitEmpty, showErrors } from "@/lib/utils";
import { isAxiosError } from "axios";
import { useMutationCreateItem } from "../_api/mutations/useMutationCreateItem";
import { useMutationUpdateItem } from "../_api/mutations/useMutationUpdateItem";
import { EMPTY_OPTION } from "@/data/global_data";
import { useQueryGetAllIngredientsGenericName } from "../../_ingredients/_api/queries/useQueryGetAllIngredientsGenericName";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SearchDropdown from "@/components/base/SearchDropdown";
import { useQueryGetItem } from "../_api/queries/useQueryGetItem";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import BaseSelect from "@/components/base/BaseSelect";
import { Input } from "@/components/ui/input";
import { useQueryGetAllUnitsDropdown } from "@/app/(app)/units/_api/queries/useQueryGetAllUnitsDropdown";
import { Textarea } from "@/components/ui/textarea";
import { useQueryGetAllCategoriesDropdown } from "@/app/(app)/categories/_api/queries/useQueryGetAllCategoriesDropdown";
import { useQueryGetAllCostCentersDropdown } from "@/app/(app)/cost-centers/_api/queries/useQueryGetAllCostCentersDropdown";
import AppTable from "@/components/base/AppTable";
import { useQueryGetAllIngredientsDropdown } from "../../_ingredients/_api/queries/useQueryGetAllIngredientsDropdown";
import { toast } from "sonner";

const item_types = [
  {
    id: 1,
    name: "key",
  },
  {
    id: 2,
    name: "batch",
  },
];
type TProps = {
  onCancel: () => void;
} & GlobalFormType;
export default function ItemForm({ id = "", type, onCancel }: TProps) {
  const { data, isLoading: isLoadingItem } = useQueryGetItem({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });
  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
  });
  const { control, handleSubmit, reset, watch } = form;
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "batch_items",
  });
  const item_type = watch("item_type")?.id;
  // const [genericName, setGenericName] = useState(EMPTY_OPTIONS_DATA);
  const { data: genericNames, isLoading: isLoadingGenericNames } =
    useQueryGetAllIngredientsGenericName({});
  const { data: categories, isLoading: isLoadingCategories } =
    useQueryGetAllCategoriesDropdown({
      params: {
        parent_category: "yes",
      },
    });
  const { data: units, isLoading: isLoadingUnits } =
    useQueryGetAllUnitsDropdown({
      enabled: true,
    });
  const { data: costCenters, isLoading: isLoadingCostCenters } =
    useQueryGetAllCostCentersDropdown({});
  const { data: products, isLoading: isLoadingProducts } =
    useQueryGetAllIngredientsDropdown({
      params: {
        without_batch: "yes",
      },
    });
  const { mutate: createItem, isPending } = useMutationCreateItem();
  const { mutate: updateItem, isPending: isPendingUpdateItem } =
    useMutationUpdateItem();
  const queryClient = useQueryClient();
  const categoryParentID = watch("category")?.id || "";
  const { data: subCategories, isLoading: isLoadingSubCategories } =
    useQueryGetAllCategoriesDropdown({
      params: {
        parent_id: categoryParentID,
      },
    });
  // useEffect(() => {
  //   if (!categoryParentID) return;
  //   setValue("sub_category", EMPTY_OPTION);
  // }, [categoryParentID]);
  useEffect(() => {
    if (type === "update" && data) {
      console.log("👉 ~ ItemForm ~ data:", data);
      const omit = omitEmpty(data);

      reset({
        ...omit,
        item_type: item_types.find((item) => item.name == data.item_type),
      });
    }
  }, [data, reset, type]);
  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "Item is created successfully!"
        : "Item is updated successfully!";
    queryClient.invalidateQueries({ queryKey: ["get-items-query"] });
    queryClient.invalidateQueries({ queryKey: ["get-item-data"] });
    toast.success(message);
    reset();
    onCancel();
  };
  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create ingredient."
        : "Failed to update ingredient.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: ItemSchemaType) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    if (item_type != 2 && !Boolean(values.low_stock_threshold)) {
      toast.error("Low stock must filled");
      return;
    }
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";
    if (values.batch_items?.length == 0 && values.item_type.name == "batch") {
      toast.error("Add at least 1 product");
      return;
    }
    if (values.item_type.name == "key") {
      values.batch_items = undefined;
    }
    const payload = omitEmpty(values) as ItemSchemaType;

    (isCreate ? createItem : updateItem)(payload, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };
  function UnitCell({ index, id }: any) {
    // const product = watch(`batch_items.${index}.product`);
    // const productID = product?.id;

    const { data: units, isLoading: isLoadingUnits } =
      useQueryGetAllUnitsDropdown({
        enabled: !!id,
        params: { product_id: id || "" },
      });

    return (
      <FormField
        control={control}
        name={`batch_items.${index}.unit`}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormControl>
              {isLoadingUnits ? (
                <div className="flex items-center min-w-20 justify-center">
                  <Spinner variant="bars" />
                </div>
              ) : (
                <BaseSelect
                  placeholder={id ? "Select a unit" : "Select a product first"}
                  options={units ?? []}
                  fieldState={fieldState}
                  value={field.value?.id ? String(field.value.id) : ""}
                  disabled={!id}
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

  const isLoading =
    isLoadingItem ||
    isLoadingUnits ||
    isLoadingCategories ||
    isLoadingCostCenters ||
    isLoadingSubCategories ||
    isLoadingProducts;
  const isSubmitting = isPending || isPendingUpdateItem;
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
        <FormField
          control={control}
          name="item_type"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <BaseSelect
                  placeholder={"Select a type"}
                  options={item_types ?? []}
                  fieldState={fieldState}
                  value={field.value?.id ? String(field.value.id) : ""}
                  // disabled={!productID}
                  onValueChange={(val) => {
                    if (!!val) {
                      const selected = item_types?.find(
                        (u: { id: string | number; name: string }) =>
                          String(u.id) === val
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
          name="generic_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <SearchDropdown
                  options={(genericNames || []).map(
                    (generic: any) => generic.name
                  )}
                  loading={isLoadingGenericNames}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter a name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="default_unit"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>UOM</FormLabel>
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter a code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {item_type != 2 && (
          <FormField
            control={control}
            name="low_stock_threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Low Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter a low stock threshold"
                    // className={
                    //   "border py-1.5 px-2 rounded-lg text-sm placeholder:text-sm"
                    // }
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="category"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <BaseSelect
                  placeholder="Select a category"
                  options={categories}
                  fieldState={fieldState}
                  value={field.value?.id ? String(field.value.id) : ""}
                  onValueChange={(val) => {
                    if (!!val) {
                      const selected = categories.find(
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
          control={form.control}
          name="sub_category"
          render={({ field, fieldState }) => {
            // const { data: subCategories, isLoading: isLoadingSubCategories } =
            //   useQueryGetAllCategoriesDropdown({
            //     params: {
            //       parent_id: categoryParentID,
            //     },
            //   });
            return (
              <FormItem>
                <FormLabel>Sub Category</FormLabel>
                <FormControl>
                  {
                    <BaseSelect
                      placeholder="Select a category"
                      options={subCategories}
                      fieldState={fieldState}
                      value={field.value?.id ? String(field.value.id) : ""}
                      onValueChange={(val) => {
                        if (!!val) {
                          const selected = subCategories.find(
                            (b: { id: string | number; name: string }) =>
                              String(b.id) == val
                          );
                          field.onChange(selected);
                        }
                      }}
                    />
                  }
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={control}
          name="cost_center"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Cost center</FormLabel>
              <FormControl>
                <BaseSelect
                  placeholder={"Select a cost center"}
                  options={costCenters ?? []}
                  fieldState={fieldState}
                  value={field.value?.id ? String(field.value.id) : ""}
                  // disabled={!productID}
                  onValueChange={(val) => {
                    if (!!val) {
                      const selected = costCenters?.find(
                        (u: { id: string | number; name: string }) =>
                          String(u.id) === val
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter a short description" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {watch("item_type")?.name == "batch" && (
          <>
            <div className="flex items-center pb-2">
              <Button
                type="button"
                variant={"outline"}
                // size={"icon"}
                onClick={() =>
                  prepend({
                    product: EMPTY_OPTION,
                    unit: EMPTY_OPTION,
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
              columns={[
                {
                  header: "Product",
                  accessorKey: "product",
                  cell: ({ row }) => {
                    const index = row.index;
                    return (
                      <FormField
                        control={control}
                        name={`batch_items.${index}.product`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <BaseSelect
                                placeholder="Select a product"
                                options={products}
                                fieldState={fieldState}
                                value={
                                  field.value?.id ? String(field.value.id) : ""
                                }
                                onValueChange={(val) => {
                                  if (!!val) {
                                    const selected = products.find(
                                      (b: {
                                        id: string | number;
                                        name: string;
                                      }) => String(b.id) == val
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
                    );
                  },
                },
                {
                  header: "Quantity",
                  accessorKey: "quantity",
                  cell: ({ row }) => {
                    const index = row.index;
                    return (
                      <FormField
                        control={control}
                        name={`batch_items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Quantity</FormLabel> */}
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
                {
                  header: "UOM",
                  accessorKey: "unit",
                  cell: ({ row }) => {
                    const index = row.index;
                    const product = watch(`batch_items.${index}.product`);
                    const productID = product?.id;

                    // const { data: units, isLoading: isLoadingUnits } =
                    //   useQueryGetAllUnitsDropdown({
                    //     enabled: !!productID,
                    //     params: { product_id: productID || "" },
                    //   });

                    return (
                      // <FormField
                      //   control={control}
                      //   name={`batch_items.${index}.unit`}
                      //   render={({ field, fieldState }) => (
                      //     <FormItem>
                      //       <FormControl>
                      //         {isLoadingUnits ? (
                      //           <div className="flex items-center min-w-20 justify-center">
                      //             <Spinner variant="bars" />
                      //           </div>
                      //         ) : (
                      //           <BaseSelect
                      //             placeholder={
                      //               productID
                      //                 ? "Select a unit"
                      //                 : "Select a product first"
                      //             }
                      //             options={units ?? []}
                      //             fieldState={fieldState}
                      //             value={
                      //               field.value?.id
                      //                 ? String(field.value.id)
                      //                 : ""
                      //             }
                      //             disabled={!productID}
                      //             onValueChange={(val) => {
                      //               if (!!val) {
                      //                 const selected = units?.find(
                      //                   (u: {
                      //                     id: string | number;
                      //                     name: string;
                      //                   }) => String(u.id) === val
                      //                 );
                      //                 field.onChange(selected);
                      //               }
                      //             }}
                      //           />
                      //         )}
                      //       </FormControl>
                      //       <FormMessage />
                      //     </FormItem>
                      //   )}
                      // />
                      <UnitCell index={index} id={productID} />
                    );
                  },
                },

                {
                  header: "Action",
                  id: "actions",
                  cell: ({ row }) => {
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
              ]}
            />
          </>
        )}
        <div className="col-span-full flex items-center justify-end gap-3">
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
