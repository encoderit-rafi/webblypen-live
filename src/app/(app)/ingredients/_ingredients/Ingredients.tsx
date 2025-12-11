"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import { Eye, Plus, SquarePen, Trash2, X } from "lucide-react";
import { AppPagination } from "@/components/base/AppPagination";
import { GLOBAL_FORM_DATA, ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetAllIngredients } from "./_api/queries/useQueryGetAllIngredients";
import { useMutationDeleteIngredient } from "./_api/mutations/useMutationDeleteIngredient";
import AppSearch from "@/components/base/AppSearch";
import { ActionsType, GlobalFormType } from "@/types/global";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import {
  // IngredientFormType,
  IngredientSchemaType,
} from "./_types/ingredient_types";
import IngredientForm from "./_component/IngredientForm";
import { useManageUrl } from "@/hooks/use-manage-url";
import AppStatus from "@/components/base/AppStatus";
import AppStatusToggle from "@/components/base/AppStatusToggle";
import { useMutationUpdateIngredientStatus } from "./_api/mutations/useMutationUpdateIngredientStatus";
import { useUserPermissions } from "@/hooks/use-user-permission";
import BaseDialog from "@/components/base/BaseDialog";
import { BaseFilter } from "@/components/base/BaseFilter";
import IngredientCard from "@/components/base/cards/IngredientCard";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
// import IngredientCard from "./_component/IngredientCard";

export default function Ingredients() {
  const [ingredientID, setIngredientID] = useState<string | number | null>(
    null
  );
  const {
    mutate: updateIngredientStatus,
    isPending: isPendingUpdateIngredientStatus,
  } = useMutationUpdateIngredientStatus();
  const permissions = useUserPermissions(PERMISSIONS.product);

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);

  const { data, status } = useQueryGetAllIngredients({});
  type IngredientsAPIType = (typeof data.data)[number];

  const { mutate: deleteIngredient, isPending: isPendingDeleteIngredient } =
    useMutationDeleteIngredient();
  const { getParams, setParams } = useManageUrl();
  const { page } = getParams;

  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  function handelIngredientStatusToggle(ingredient: IngredientSchemaType) {
    const isActive = ingredient.is_active;
    console.log("🚀 ~ handelIngredientStatusToggle ~ isActive:", isActive);
    updateIngredientStatus(
      { id: ingredient.id || "", status: !isActive },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-ingredients-query"],
          });
          toast.success(
            // `User ${!isActive ? "activated" : "deactivated"} successfully!`
            `${ingredient.name} ${
              !isActive ? "activated" : "deactivated"
            } successfully!`
          );
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ||
                "Failed to update ingredient status."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      }
    );
  }
  const columns: ColumnDef<IngredientsAPIType>[] = [
    {
      header: "Product Name",
      accessorKey: "generic_name",
      cell: (props) => {
        const name = props.getValue() as string;
        return name;
      },
    },
    {
      header: "Code",
      accessorKey: "code",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Brand Name",
      accessorKey: "name",
      cell: (props) => {
        const name = props.getValue() as string;
        return name;
      },
    },
    {
      header: "Item Type",
      accessorKey: "item_type",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (props) => {
        const category = props.row.original.category;
        return category?.name || "-";
      },
    },
    {
      header: "Sub Category",
      accessorKey: "sub_category",
      cell: (props) => {
        const sub_category = props.row.original.sub_category;
        return sub_category?.name || "-";
      },
    },
    {
      header: "Unit",
      accessorKey: "default_unit",
      cell: (props) => {
        const default_unit = props.row.original.default_unit;
        return default_unit?.name || "-";
      },
    },

    {
      header: "Price",
      accessorKey: "default_unit_price",
      cell: (props) => {
        const price = props.getValue() as string;
        return price;
      },
    },
    {
      header: "VAT",
      accessorKey: "vat",
      cell: (props) => {
        const vat = props.getValue() as string;
        return vat;
      },
    },
    {
      header: "Cost Center",
      accessorKey: "cost_center",
      cell: (props) => {
        const cost_center = props.row.original.cost_center;
        return cost_center?.name || "-";
      },
    },
    {
      header: "Supplier",
      accessorKey: "supplier",
      cell: (props) => {
        const supplier = props.row.original.supplier;
        return supplier?.name || "-";
      },
    },

    {
      header: "Active",
      accessorKey: "is_active",
      cell: (props) => {
        const data = props.cell.row.original;

        return (
          <AppStatusToggle
            isLoading={
              ingredientID == data.id && isPendingUpdateIngredientStatus
            }
            isActive={props.getValue() as boolean}
            onToggle={() => {
              setIngredientID(data.id || null);
              handelIngredientStatusToggle(data);
            }}
          />
        );
      },
    },
    {
      header: "Actions",
      cell: (props) => {
        const data = props.cell.row.original;
        const Actions = [
          {
            type: "view",
            label: "View",
            variant: "default",
            show: true,
            icon: <Eye {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "view",
                title: `View`,
                description: "view ingredient",
                id: data.id,
              });
            },
          },
          {
            type: "edit",
            label: "Edit",
            variant: "default",
            show: permissions.update_product,
            icon: <SquarePen {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "update",
                title: `Update | ${data.name}`,
                description: "update ingredient",
                id: data.id,
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_product,
            icon: <Trash2 {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "delete",
                title: "Are you sure?",
                description: `Are you sure you want to delete? All your data will be removed permanently.`,
                id: data.id,
              });
            },
          },
        ] as const satisfies readonly ActionsType[];

        const visibleActions = Actions.filter((a) => a.show);
        return (
          <AppActionsDropdown
            actions={visibleActions}
            disabled={!visibleActions.length}
          />
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="max-w-sm">
            <AppSearch />
          </div>
          <BaseFilter
            filters={[
              "product_id",
              "category_id",
              "sub_category_id",
              // "branch_id",
              "unit_id",
              "supplier_id",
              "cost_center_id",
            ]}
          />
        </div>
        {permissions.create_product && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                type: "create",
                title: "Create",
                description: "create a new ingredient",
              })
            }
          >
            <Plus className="mr-2" />
            Add Ingredient
          </Button>
        )}
      </div>

      <AppStatus status={status} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>

      <IngredientCard
        title={formData.title || ""}
        open={formData.type === "view"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
        id={formData.id || ""}
      />

      <BaseDialog
        title={formData?.title || ""}
        description={formData?.description || ""}
        component_props={{
          content: {
            className: "max-w-full sm:max-w-7xl",
          },
        }}
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
      >
        <IngredientForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>

      {/* ✅ Delete */}
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteIngredient}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteIngredient(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-ingredients-query"],
                });
                toast.success("Ingredient deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete Ingredient."
                  );
                } else {
                  toast.error("Something went wrong.");
                }
              },
            }
          );
        }}
      />
    </div>
  );
}
