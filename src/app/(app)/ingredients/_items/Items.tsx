"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import { AppPagination } from "@/components/base/AppPagination";
import { GLOBAL_FORM_DATA, ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { ActionsType, GlobalFormType } from "@/types/global";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import ItemForm from "./_component/ItemForm";
import { useMutationDeleteItem } from "../_items/_api/mutations/useMutationDeleteItem";
import { ItemSchemaType } from "./_types/item_types";
import { useManageUrl } from "@/hooks/use-manage-url";
import { useQueryGetAllItems } from "./_api/queries/useQueryGetAllItems";
import AppStatus from "@/components/base/AppStatus";
import ItemCard from "@/app/(app)/ingredients/_items/_component/ItemCard";
import AppStatusToggle from "@/components/base/AppStatusToggle";
// import { useMutationUpdateItemStatus } from "../_Items/_api/mutations/useMutationUpdateItemStatus";
import { useUserPermissions } from "@/hooks/use-user-permission";
import { BaseFilter } from "@/components/base/BaseFilter";
import BaseDialog from "@/components/base/BaseDialog";
import { useMutationUpdateIngredientStatus } from "../_ingredients/_api/mutations/useMutationUpdateIngredientStatus";
export default function Items() {
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);
  const permissions = useUserPermissions(PERMISSIONS.product);

  const [ItemID, setItemID] = useState<string | number | null>(null);
  const { mutate: updateItemStatus, isPending: isPendingUpdateItemStatus } =
    useMutationUpdateIngredientStatus();
  function handelItemStatusToggle(Item: ItemSchemaType) {
    const isActive = Item.is_active;
    console.log("🚀 ~ handelItemStatusToggle ~ isActive:", isActive);
    updateItemStatus(
      { id: Item.id || "", status: !isActive },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-items-query"],
          });
          toast.success(
            // `User ${!isActive ? "activated" : "deactivated"} successfully!`
            `${Item.name} ${
              !isActive ? "activated" : "deactivated"
            } successfully!`
          );
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update Item status."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      }
    );
  }

  const queryClient = useQueryClient();
  const { getParam } = useManageUrl();

  const { data, status } = useQueryGetAllItems({
    enabled: getParam("active_tab") == "items",
  });
  type ItemsAPIType = (typeof data.data)[number];

  const { mutate: deleteItem, isPending: isPendingDeleteItem } =
    useMutationDeleteItem();
  const { getParams, setParams } = useManageUrl();
  const { page } = getParams;
  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  const columns: ColumnDef<ItemsAPIType>[] = [
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
        return category.name;
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
      header: "Cost Center",
      accessorKey: "cost_center",
      cell: (props) => {
        const cost_center = props.row.original.cost_center;
        return cost_center?.name || "-";
      },
    },
    {
      header: "Items",
      accessorKey: "batch_items",
      cell: (props) => {
        const details = props.getValue() as {
          id: string | number;
          product: {
            name: string;
          };
          unit: {
            id: number | string;
            name: number | string;
            code: number | string;
          };
          quantity: number;
        }[];
        if (details?.length == 0) {
          return null;
        }
        return (
          <AppTable
            data={details ?? []}
            columns={[
              {
                // header: "Product",
                header: "Name",
                accessorKey: "product.name",
                cell: (props) => props.getValue() as string,
              },
              {
                header: "UOM",
                accessorKey: "unit.name",

                cell: (props) => props.getValue() as string,
              },
              {
                header: "Quantity",
                accessorKey: "quantity",
                cell: (props) => props.getValue() as string,
              },
            ]}
          />
        );
      },
    },
    {
      header: "Active",
      accessorKey: "is_active",
      cell: (props) => {
        const data = props.cell.row.original;
        // const Item = {
        //   id: data.id,
        //   status: props.getValue() as boolean,
        // };
        return (
          <AppStatusToggle
            isLoading={ItemID == data.id && isPendingUpdateItemStatus}
            isActive={props.getValue() as boolean}
            onToggle={() => {
              setItemID(data.id || null);
              handelItemStatusToggle(data);
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
                title: `View Item`,
                description: "view item",
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
                title: `Update  | ${data.name}`,
                description: "update item",
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
                description: `Are you sure you want to delete ${data.name}? All your data will be removed permanently.`,
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
                description: "create a new open market",
              })
            }
          >
            <Plus className="mr-2" />
            Add Item
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
        <ItemForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>
      <ItemCard
        title={formData.title || ""}
        open={formData.type === "view"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
        id={formData.id || ""}
      />

      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteItem}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteItem(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-items-query"],
                });
                toast.success("Item is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  toast.error(
                    error.response?.data?.message || "Failed to delete Item."
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
