"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
// import toast from "react-hot-toast";
import {
  IngredientSchema,
  IngredientSchemaType,
} from "../_types/ingredient_types";
import { GlobalFormType } from "@/types/global";
import { useQueryClient } from "@tanstack/react-query";
import { omitEmpty, showErrors } from "@/lib/utils";
import { isAxiosError } from "axios";
import { useMutationCreateIngredient } from "../_api/mutations/useMutationCreateIngredient";
import { useMutationUpdateIngredient } from "../_api/mutations/useMutationUpdateIngredient";
import { useQueryGetAllIngredientsGenericName } from "../_api/queries/useQueryGetAllIngredientsGenericName";
import { EMPTY_OPTIONS_DATA } from "@/data/global_data";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "react-aria-components";
import { Textarea } from "@/components/ui/textarea";
import { useQueryGetAllCategoriesDropdown } from "@/app/(app)/categories/_api/queries/useQueryGetAllCategoriesDropdown";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Button } from "@/components/ui/button";
import BaseSelect from "@/components/base/BaseSelect";
import { useQueryGetAllSuppliersDropdown } from "@/app/(app)/suppliers/_api/queries/useQueryGetAllSuppliersDropdown";
import { useQueryGetAllUnitsDropdown } from "@/app/(app)/units/_api/queries/useQueryGetAllUnitsDropdown";
import { useQueryGetAllCostCentersDropdown } from "@/app/(app)/cost-centers/_api/queries/useQueryGetAllCostCentersDropdown";
import { useQueryGetIngredient } from "../_api/queries/useQueryGetIngredient";
import SearchDropdown from "@/components/base/SearchDropdown";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;

export default function IngredientForm({ id = "", type, onCancel }: TProps) {
  const form = useForm<IngredientSchemaType>({
    resolver: zodResolver(IngredientSchema),
  });
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = form;
  console.log("👉 ~ IngredientForm ~ errors:", errors);
  const { data, isLoading: isLoadingIngredient } = useQueryGetIngredient({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });
  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);

      reset(omit);
    }
  }, [data, reset, type]);
  // const [genericName, setGenericName] = useState(EMPTY_OPTIONS_DATA);
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
  const { data: suppliers, isLoading: isLoadingSuppliers } =
    useQueryGetAllSuppliersDropdown({});
  const { data: genericNames, isLoading: isLoadingGenericNames } =
    useQueryGetAllIngredientsGenericName({});

  const { mutate: createIngredient, isPending } = useMutationCreateIngredient();
  const { mutate: updateIngredient, isPending: isPendingUpdateIngredient } =
    useMutationUpdateIngredient();

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
  //   setValue("sub_category", EMPTY_OPTIONS_DATA);
  // }, [categoryParentID]);

  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "Ingredient is created successfully!"
        : "Ingredient is updated successfully!";
    queryClient.invalidateQueries({ queryKey: ["get-ingredients-query"] });
    queryClient.invalidateQueries({ queryKey: ["get-ingredient-data"] });
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

  const onSubmit = (values: IngredientSchemaType) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    // return;
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    const payload = omitEmpty({
      ...values,
      type: "General",
    }) as IngredientSchemaType;

    (isCreate ? createIngredient : updateIngredient)(payload, {
      onSuccess: () => onSuccess(action),
      onError: (err) => onError(action, err),
    });
  };

  const isLoading =
    isLoadingCategories ||
    isLoadingSuppliers ||
    isLoadingUnits ||
    isLoadingCostCenters ||
    // isLoadingSubCategories ||
    isLoadingIngredient;
  const isSubmitting = isPending || isPendingUpdateIngredient;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <Spinner variant="bars" />
      </div>
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="gap-4 grid grid-cols-1 md:grid-cols-2 w-full"
      >
        <div className="col-span-full">
          <FormField
            control={control}
            name="is_useable_for_item"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 rounded-md p-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Is useable for key item
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a name"
                  className={
                    "border py-1.5 px-2 rounded-lg text-sm placeholder:text-sm"
                  }
                  {...field}
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
                <Input
                  placeholder="Enter a code"
                  className={
                    "border py-1.5 px-2 rounded-lg text-sm placeholder:text-sm"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  className={
                    "border py-1.5 px-2 rounded-lg text-sm placeholder:text-sm"
                  }
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
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
            return (
              <FormItem>
                <FormLabel>Sub Category</FormLabel>
                <FormControl>
                  {isLoadingSubCategories ? (
                    <div className="flex items-center min-w-20 justify-center">
                      <Spinner variant="bars" />
                    </div>
                  ) : (
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
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
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
          name="default_unit"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>UOM</FormLabel>
              <FormControl>
                <BaseSelect
                  placeholder={"Select a unit"}
                  options={units ?? []}
                  fieldState={fieldState}
                  value={field.value?.id ? String(field.value.id) : ""}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
          name="default_unit_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter a default unit price"
                  className={
                    "border py-1.5 px-2 rounded-lg text-sm placeholder:text-sm"
                  }
                  {...field}
                />
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
              <FormLabel>VAT</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter a vat"
                  className={
                    "border py-1.5 px-2 rounded-lg text-sm placeholder:text-sm"
                  }
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {watch("is_useable_for_item") && (
          <FormField
            control={control}
            name="ideal_recovery_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ideal Recovery Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter a ideal recovery rate"
                    className={
                      "border py-1.5 px-2 rounded-lg text-sm placeholder:text-sm"
                    }
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="col-span-full">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a short description"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
//346
