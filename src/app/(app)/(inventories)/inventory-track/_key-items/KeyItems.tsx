"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, SquarePen, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import { AppPagination } from "@/components/base/AppPagination";
import { INITIAL_FORM_DATA } from "./_data/data";
// import { InventoryFormType } from "./_types/inventory_types";
import { useQueryGetAllDailyTrackInventories } from "./_api/queries/useQueryGetAllDailyTrackInventories";
// import InventoryForm from "./_component/InventoryForm";
import AppStatus from "@/components/base/AppStatus";
import { useManageUrl } from "@/hooks/use-manage-url";

import ProductDropdown from "@/components/dropdowns/ProductDropdown";
import BrandDropdown from "@/components/dropdowns/BrandDropdown";
import BranchDropdown from "@/components/dropdowns/BranchDropdown";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import { ActionsType, GlobalFormType } from "@/types/global";
import { GLOBAL_FORM_DATA, ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import InventoryDailyTrackCard from "@/components/base/cards/InventoryDailyTrackCard";
// import { InventoryDailyTrackSchemaFormType } from "./_types/inventory_types";
import InventoryItemForm from "./_component/InventoryItemForm";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
// import { useMutationDeleteKeyItems } from "./_api/mutations/useMutationDeleteKeyItems";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { useMutationDeleteKeyItems } from "./_api/mutations/useMutationDeleteKeyItems";
import { useUserPermissions } from "@/hooks/use-user-permission";
import { BaseFilter } from "@/components/base/BaseFilter";
import BaseDialog from "@/components/base/BaseDialog";

export default function KeyItems() {
  const queryClient = useQueryClient();
  const permissions = useUserPermissions(PERMISSIONS.daily_key_item);

  // const [formData, setFormData] =
  //   useState<InventoryDailyTrackSchemaFormType>(INITIAL_FORM_DATA);
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);

  const { mutate: deleteKeyItems, isPending: isPendingDeleteKeyItems } =
    useMutationDeleteKeyItems();

  const { getParams, setParams } = useManageUrl();
  const { page, created_at_from, created_at_to } = getParams;

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  useEffect(() => {
    if (created_at_to || created_at_from) {
      setDateRange({
        from: new Date(created_at_from),
        to: new Date(created_at_to),
      });
      setParams({
        ...getParams,
        created_at_from: format(created_at_from, "yyyy-MM-dd"),
        created_at_to: format(created_at_to, "yyyy-MM-dd"),
      });
    }
  }, []);
  const { data, status } = useQueryGetAllDailyTrackInventories({});
  type InventoriesAPIType = (typeof data.data)[number];

  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);

  const columns: ColumnDef<InventoriesAPIType>[] = [
    {
      header: "Ingredient",
      accessorKey: "ingredient.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Out",
      accessorKey: "total_out_quantity",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Unit",
      accessorKey: "unit.name",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Recovery Rate (%)",
      accessorKey: "recovery_rate",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Ideal Recovery Rate (%)",
      accessorKey: "ideal_recovery_rate",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Variance (%)",
      accessorKey: "variance",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Adjusted Variance (%)",
      accessorKey: "adjusted_variance",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Cost price",
      accessorKey: "cost_price",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Intermediate Product - Key Items",
      accessorKey: "details",
      cell: (props) => {
        const details = props.getValue() as {
          id: 10;
          inventory_count_id: number;
          product_id: number;
          product: {
            name: string;
          };
          unit: {
            id: number | string;
            name: number | string;
            code: number | string;
          };

          default_unit_id: number;
          total_in_quantity: number;
          default_unit_quantity: number;
        }[];

        return (
          <AppTable
            data={details ?? []}
            columns={[
              {
                // header: "Product",
                header: "Name",
                accessorKey: "name",
                cell: ({ row }) => {
                  const data = row.original;
                  return data?.product?.name;
                },
              },
              {
                // header: "Product",
                header: "In",
                accessorKey: "total_in_quantity",
                cell: ({ row }) => {
                  const data = row.original;
                  return data?.total_in_quantity;
                },
              },
              {
                // header: "Product",
                header: "Unit",
                accessorKey: "unit",
                cell: ({ row }) => {
                  const data = row.original;
                  return data?.unit?.name;
                },
              },
            ]}
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
            show: permissions.view_daily_key_item,
            icon: <Eye {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "view",
                title: `View`,
                description: "view key item",
                id: data.id,
              });
            },
          },
          {
            type: "edit",
            label: "Edit",
            variant: "default",
            show: permissions.update_daily_key_item,
            icon: <SquarePen {...ICON_ATTRS} />,

            action: () => {
              setFormData({
                type: "update",
                title: "Update",
                description: "update key item",
                id: data.id,
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_daily_key_item,
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
        // if (data.is_po_created) {
        //   return null;
        // }
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
              "branch_id",
            ]}
          />
        </div>
        {permissions.create_daily_key_item && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: "Create",
                description: "create a new open market",
              })
            }
          >
            <Plus className="mr-2" />
            Add Key Items
          </Button>
        )}
      </div>
      <div className="flex items-center mb-4 gap-2">
        <div className="flex items-center gap-1">
          <div className="max-w-sm">
            <AppDateRangePicker
              placeholder="Select created date"
              dateRange={dateRange}
              onChangeValue={(range) => {
                setDateRange(range);
                setParams({
                  ...getParams,
                  created_at_from: range.from
                    ? format(range.from, "yyyy-MM-dd")
                    : undefined,
                  created_at_to: range.to
                    ? format(range.to, "yyyy-MM-dd")
                    : undefined,
                });
              }}
              className="h-8"
            />
          </div>
          {!!created_at_from && !!created_at_to && (
            <X
              onClick={() => {
                setParams({}, ["created_at_to", "created_at_from"]);
                setDateRange(undefined);
              }}
              className="size-4"
            />
          )}
        </div>
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
            className: "max-w-full sm:max-w-7xl md:max-w-7xl lg:max-w-7xl",
          },
        }}
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
      >
        <InventoryItemForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>
      <InventoryDailyTrackCard
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
        loading={isPendingDeleteKeyItems}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteKeyItems(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-daily-key-items-query"],
                });
                toast.success("Inventory track is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error: any) {
                if (isAxiosError(error)) {
                  console.error(
                    "Error deleting inventory track.",
                    error.response?.data?.message
                  );
                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete inventory track."
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
