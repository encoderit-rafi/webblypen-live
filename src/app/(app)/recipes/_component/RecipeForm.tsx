"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
// import toast from "react-hot-toast";
import { RecipeSchema, RecipeSchemaType } from "../_types/recipe_types";
import { GlobalFormType, ModalType } from "@/types/global";
import { nanoid } from "nanoid";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import AppDialog from "@/components/base/AppDialog";
import { Plus, Trash2 } from "lucide-react";

import { useMutationCreateRecipe } from "../_api/mutations/useMutationCreateRecipe";
import { useMutationUpdateRecipe } from "../_api/mutations/useMutationUpdateRecipe";
import { EMPTY_OPTIONS_DATA } from "@/data/global_data";
import { INITIAL_FORM_DATA } from "../_data/data";

import { FormInput } from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import ControlProductDropdown from "@/components/control_dropdowns/ControlProductDropdown";
import ControlUnitDropdown from "@/components/control_dropdowns/ControlUnitDropdown";
import ControlRecipeCategoryDropdown from "@/components/control_dropdowns/ControlRecipeCategoriesDropdown";
import { optionFormat } from "@/utils/optionsFormat";
import { useQueryGetRecipe } from "../_api/queries/useQueryGetRecipe";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQueryGetAllRecipeCategoriesDropdown } from "../_api/queries/useQueryGetAllRecipesDropdown";
import BaseSelect from "@/components/base/BaseSelect";
import { Textarea } from "@/components/ui/textarea";
import { useQueryGetAllIngredientsDropdown } from "../../ingredients/_ingredients/_api/queries/useQueryGetAllIngredientsDropdown";
import { useQueryGetAllUnitsDropdown } from "../../units/_api/queries/useQueryGetAllUnitsDropdown";
import AppTable from "@/components/base/AppTable";
import { toast } from "sonner";
import { omitEmpty, showErrors } from "@/lib/utils";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;
export default function RecipeForm({ id = "", type, onCancel }: TProps) {
  const { data, isLoading: isLoadingRecipe } = useQueryGetRecipe({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });
  const { data: recipeCategories, isLoading: isLoadingRecipeCategories } =
    useQueryGetAllRecipeCategoriesDropdown({});
  const { data: products, isLoading: isLoadingProducts } =
    useQueryGetAllIngredientsDropdown({
      params: {
        // type: PRODUCT_TYPE.general,
        without_batch: "yes",
      },
    });
  const form = useForm<RecipeSchemaType>({
    resolver: zodResolver(RecipeSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;
  console.log("👉 ~ RecipeForm ~ errors:", errors);
  // const { type: formType, data: initialData } = formData;

  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);
      reset(omit);
    }
  }, [data, reset, type]);
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "recipe_ingredients",
  });

  const { mutate: createRecipe, isPending } = useMutationCreateRecipe();
  const { mutate: updateRecipe, isPending: isPendingUpdateRecipe } =
    useMutationUpdateRecipe();

  const queryClient = useQueryClient();

  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "Recipe created successfully!"
        : "Recipe updated successfully!";
    queryClient.invalidateQueries({ queryKey: ["get-recipes-query"] });
    queryClient.invalidateQueries({ queryKey: ["get-recipes-data"] });
    toast.success(message);
    reset();
    onCancel();
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

  const onSubmit = (values: RecipeSchemaType) => {
    console.log("🚀 Recipe form values:", values);
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";
    (isCreate ? createRecipe : updateRecipe)(values, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };
  function UnitCell({ index, id }: any) {
    // const product = watch(`recipe_ingredients.${index}.product`);
    // const productID = product?.id;

    const { data: units, isLoading: isLoadingUnits } =
      useQueryGetAllUnitsDropdown({
        enabled: !!id,
        params: { product_id: id || "" },
      });

    return (
      <FormField
        control={control}
        name={`recipe_ingredients.${index}.unit`}
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
    isLoadingRecipe || isLoadingRecipeCategories || isLoadingProducts;
  const isSubmitting = isPending || isPendingUpdateRecipe;

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter recipe name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipe_category"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <BaseSelect
                  placeholder="Select a category"
                  options={recipeCategories}
                  fieldState={fieldState}
                  value={field.value?.id ? String(field.value.id) : ""}
                  onValueChange={(val) => {
                    if (!!val) {
                      const selected = recipeCategories.find(
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
                <Input placeholder="Enter recipe code" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter a price" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="vat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT(%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter a vat" {...field} />
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
        {/* Add ingredient button */}
        <div className="flex items-center pb-2">
          <Button
            type="button"
            variant={"outline"}
            onClick={() =>
              prepend({
                product: EMPTY_OPTIONS_DATA,
                unit: EMPTY_OPTIONS_DATA,
                quantity: 0,
              })
            }
          >
            <Plus />
            Add Ingredients
          </Button>
        </div>

        {/* Table layout for ingredients */}
        {/* <div className="grid grid-cols-4">
          <div className="border p-1">Product</div>
          <div className="border p-1">UOM</div>
          <div className="border p-1">Quantity</div>
          <div className="border p-1">Action</div>

          <div className="col-span-full">
            {fields.map((field, index) => {
              const rowErrors = errors.recipe_ingredients?.[index];
              const productID = watch(
                `recipe_ingredients.${index}.product_id`
              )?.id;

              return (
                <div
                  key={`${field.id}-${index}-${nanoid()}`}
                  className={`grid grid-cols-4 ${
                    rowErrors ? "border-red-500" : "border-muted"
                  }`}
                >
                  <div className="border p-1">
                    <ControlProductDropdown
                      name={`recipe_ingredients.${index}.product_id`}
                      placeholder="Select Product"
                      control={control}
                      errors={errors}
                    />
                  </div>

                  <div className="border p-1">
                    <ControlUnitDropdown
                      name={`recipe_ingredients.${index}.unit_id`}
                      placeholder="Select Unit"
                      control={control}
                      errors={errors}
                      params={{
                        product_id: productID,
                      }}
                    />
                  </div>

                  <div className="border p-1">
                    <FormInput
                      type="number"
                      name={`recipe_ingredients.${index}.quantity`}
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
        </div> */}
        <AppTable
          data={fields ?? []}
          columns={[
            {
              // header: "Product",
              header: "Product",
              accessorKey: "product",
              cell: ({ row }) => {
                const index = row.index;
                return (
                  <FormField
                    control={control}
                    name={`recipe_ingredients.${index}.product`}
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
                    name={`recipe_ingredients.${index}.quantity`}
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
                const product = watch(`recipe_ingredients.${index}.product`);
                const productID = product?.id;

                // // Fetch units dynamically based on selected product ID
                // const { data: units, isLoading: isLoadingUnits } =
                //   useQueryGetAllUnitsDropdown({
                //     enabled: !!productID, // Only fetch when product is selected
                //     params: { product_id: productID || "" },
                //   });

                return (
                  // <FormField
                  //   control={control}
                  //   name={`recipe_ingredients.${index}.unit`}
                  //   render={({ field, fieldState }) => (
                  //     <FormItem>
                  //       {/* <FormLabel>Unit</FormLabel> */}
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
                  //               field.value?.id ? String(field.value.id) : ""
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
