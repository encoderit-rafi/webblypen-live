"use client";
import { ModalType } from "@/types/global";
import AppViewDialog from "../AppViewDialog";
import { useQueryGetRecipe } from "@/app/(app)/recipes/_api/queries/useQueryGetRecipe";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  RecipeSchema,
  RecipeSchemaType,
} from "@/app/(app)/recipes/_types/recipe_types";
import { zodResolver } from "@hookform/resolvers/zod";
import AppStatus from "../AppStatus";
import AppTable from "../AppTable";

type TProps = ModalType & {
  title: string;
  id: string | number;
};
const RecipeCard = ({ id, title, open, onOpenChange }: TProps) => {
  const { data, status } = useQueryGetRecipe({
    enabled: !!id,
    id: id ?? "",
  });
  const { control, reset, watch } = useForm<RecipeSchemaType>({
    resolver: zodResolver(RecipeSchema),
  });

  const { fields } = useFieldArray({
    control,
    name: "recipe_ingredients",
  });
  useEffect(() => {
    if (!!data) {
      reset(data);
    }
  }, [data, reset]);
  return (
    <AppViewDialog title={title} open={open} onOpenChange={onOpenChange}>
      <AppStatus status={status} is_data={!!data}>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {/* Basic Info */}
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Name: </span>
            {data?.name}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Category: </span>
            {data?.recipe_category?.name}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Code: </span>
            {data?.code}
          </div>

          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Price: </span>
            {data?.price}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">VAT: </span>
            {data?.vat}%
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Status: </span>
            {data?.is_active ? "Active" : "Inactive"}
          </div>

          {/* Description */}
          {data?.description && (
            <div className="p-1 whitespace-nowrap truncate col-span-3">
              <span className="font-semibold text-primary">Description: </span>
              {data?.description}
            </div>
          )}

          {/* Ingredients Section */}
          <div className="col-span-3 mt-4 mb-2 font-semibold text-primary">
            Ingredients
          </div>
          <div className="col-span-3 border rounded">
            <AppTable
              data={fields ?? []}
              columns={[
                {
                  // header: "Product",
                  header: "Product",
                  accessorKey: "product",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`recipe_ingredients.${index}.product`)?.name;
                  },
                },
                {
                  header: "Quantity",
                  accessorKey: "quantity",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`recipe_ingredients.${index}.quantity`);
                  },
                },
                {
                  header: "UOM",
                  accessorKey: "unit_id",

                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`recipe_ingredients.${index}.unit`)?.name;
                  },
                },
              ]}
            />
          </div>
        </div>
      </AppStatus>
    </AppViewDialog>
  );
};

export default RecipeCard;
