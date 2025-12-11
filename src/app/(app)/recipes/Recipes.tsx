"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
import RecipeForm from "./_component/RecipeForm";
import { RecipeSchemaType } from "./_types/recipe_types";
import { INITIAL_FORM_DATA } from "./_data/data";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetAllRecipes } from "./_api/queries/useQueryGetAllRecipes";
import { useMutationDeleteRecipe } from "./_api/mutations/useMutationDeleteRecipe";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import { ActionsType, GlobalFormType } from "@/types/global";
import { GLOBAL_FORM_DATA, ICON_ATTRS } from "@/data/global_data";
import AppStatusToggle from "@/components/base/AppStatusToggle";
import { useMutationUpdateRecipeStatus } from "./_api/mutations/useMutationUpdateRecipeStatus";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import AppStatus from "@/components/base/AppStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import { getImageSrc } from "@/utils/getImageSrc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import RecipeCard from "@/components/base/cards/RecipeCard";
import ProductDropdown from "@/components/dropdowns/ProductDropdown";
import CategoryDropdown from "@/components/dropdowns/CategoryDropdown";
import { BaseFilter } from "@/components/base/BaseFilter";
import BaseDialog from "@/components/base/BaseDialog";

export default function Recipes() {
  const { data: currentUser } = useQueryCurrentUser();

  const {
    permissions: currentUserPermissions,
    // manager_of_branches: currentUserManagerOfBranches,
  } = currentUser ?? {};
  const permissions = {
    create: currentUserPermissions?.["create_recipe"],
    update: currentUserPermissions?.["update_recipe"],
    delete: currentUserPermissions?.["delete_recipe"],
    update_status: currentUserPermissions?.["update_status_recipe"],
  };
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);

  const [recipeID, setRecipeID] = useState<string | number | null>(null);
  const { data, status } = useQueryGetAllRecipes({});
  const { getParams, setParams } = useManageUrl();
  const { page, product_id, category_id, sub_category_id } = getParams;
  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  const { mutate: deleteRecipe, isPending: isPendingDeleteRecipe } =
    useMutationDeleteRecipe();

  const { mutate: updateRecipeStatus, isPending: isPendingUpdateRecipeStatus } =
    useMutationUpdateRecipeStatus();

  function handleRecipeStatusToggle(recipe: {
    id: string | number | undefined;
    is_active: boolean;
  }) {
    const is_active = recipe.is_active;

    updateRecipeStatus(
      {
        id: recipe.id,
        status: !is_active,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-recipes-query"],
          });
          toast.success(
            `Recipe ${!is_active ? "activated" : "deactivated"} successfully!`
          );
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update Recipe status."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      }
    );
  }

  const columns: ColumnDef<RecipeSchemaType>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (props) => {
        const data = props.cell.row.original;
        const name = props.getValue() as string;
        const image = String(data.image);
        const img_src = getImageSrc(image) || "";
        const fallbackName = name.slice(0, 2);

        return (
          <div className="flex items-center gap-2">
            {/* <Avatar className="size-6">
              <AvatarImage src={img_src} />
              <AvatarFallback className="uppercase size-6 text-xs">
                {fallbackName}
              </AvatarFallback>
            </Avatar> */}
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      header: "Recipe Category",
      accessorKey: "recipe_category.name",
      cell: (props) => {
        const category = props.getValue() as string;
        return category;
      },
    },
    // {
    //   header: "Description",
    //   accessorKey: "description",
    //   cell: (props) => props.getValue() as string,
    // },
    {
      header: "Price",
      accessorKey: "price",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Active",
      accessorKey: "is_active",
      cell: (props) => {
        const data = props.cell.row.original;
        const recipe = {
          id: data.id,
          is_active: !!Number(props.getValue()),
        };
        return (
          <AppStatusToggle
            isLoading={recipeID == recipe.id && isPendingUpdateRecipeStatus}
            isActive={recipe.is_active}
            onToggle={() => {
              setRecipeID(recipe.id || null);
              handleRecipeStatusToggle(recipe);
            }}
            disabled={!permissions.update_status}
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
                description: "view recipe",
                id: data.id,
              });
            },
          },
          {
            type: "edit",
            label: "Edit",
            variant: "default",
            show: permissions.update,
            icon: <SquarePen {...ICON_ATTRS} />,

            action: () => {
              setFormData({
                type: "update",
                title: `Update  | ${data.name}`,
                description: "update recipe",
                id: data.id,
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete,
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
        const visibleActions = Actions.filter((item) => item.show);
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
            filters={["product_id", "category_id", "sub_category_id"]}
          />
        </div>

        {permissions.create && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                type: "create",
                title: "Create",
                description: "create a new recipe",
              })
            }
          >
            <Plus className="mr-2" />
            Add Recipe
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

      <RecipeCard
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
        <RecipeForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteRecipe}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteRecipe(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-recipes-query"],
                });
                toast.success("Recipes deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  console.error(
                    "Error deleting recipe.",
                    error.response?.data?.message
                  );
                  toast.error(
                    error.response?.data?.message || "Failed to delete recipe."
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
