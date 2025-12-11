"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import { Eye, Plus, SquarePen, Trash2, X } from "lucide-react";
import { AppPagination } from "@/components/base/AppPagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GLOBAL_FORM_DATA, ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetAllBatchItems } from "./_api/queries/useQueryGetAllBatchItems";
import { useMutationDeleteBatchItem } from "./_api/mutations/useMutationDeleteBatchItem";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { ActionsType, GlobalFormType } from "@/types/global";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";

import BatchItemForm from "./_component/BatchItemForm";
import { useManageUrl } from "@/hooks/use-manage-url";
import AppStatus from "@/components/base/AppStatus";
import { getImageSrc } from "@/utils/getImageSrc";
import { useQueryCurrentUser } from "@/app/(app)/users/_api/queries/useQueryCurrentUser";
import { useUserPermissions } from "@/hooks/use-user-permission";
import { DateRange } from "react-day-picker";
import BranchDropdown from "@/components/dropdowns/BranchDropdown";
import CategoryDropdown from "@/components/dropdowns/CategoryDropdown";
import ProductDropdown from "@/components/dropdowns/ProductDropdown";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { format } from "date-fns";
import { BaseFilter } from "@/components/base/BaseFilter";
import BaseDialog from "@/components/base/BaseDialog";
import InventoryBatchItemCard from "@/components/base/cards/InventoryBatchItemCard";
export default function BatchItems() {
  const permissions = useUserPermissions(PERMISSIONS.daily_batch_item);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);

  const { data, status } = useQueryGetAllBatchItems({});
  type BatchItemsAPIType = (typeof data.data)[number];

  const { mutate: deleteBatchItem, isPending: isPendingDeleteBatchItem } =
    useMutationDeleteBatchItem();
  const { getParams, setParams } = useManageUrl();
  const { page, created_at_from, created_at_to } = getParams;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  const columns: ColumnDef<BatchItemsAPIType>[] = [
    {
      header: "Branch",
      accessorKey: "branch.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Ingredients",
      accessorKey: "details",
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

        return (
          <div className="grid grid-cols-3 min-w-xs ">
            <div className="border p-1">Name</div>
            <div className="border p-1">Quantity</div>
            <div className="border p-1">Unit</div>

            {details.map((count, index) => (
              <div key={index} className="col-span-3 grid grid-cols-3">
                <div className="border p-1">{count.product.name}</div>
                <div className="border p-1">{count.quantity}</div>
                <div className="border p-1">
                  {count.unit.name}({count.unit.code})
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Batch Item",
      accessorKey: "batch_item.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Out",
      accessorKey: "batch_out_quantity",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "",
      accessorKey: "batch_unit.code",
      // cell: (props) => props.getValue() as string,
      cell: (props) => "Batch",
    },
    {
      header: "Intermediate Product Key Items",
      accessorKey: "product.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Cost Price",
      accessorKey: "cost_price",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "In",
      accessorKey: "product_in_quantity",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "",
      accessorKey: "unit.code",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Actions",
      cell: (props) => {
        const data = props.cell.row.original;
        console.log("🚀 ~ data::::", data);
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
                description: "view batch item",
                id: data.id,
              });
            },
          },
          {
            type: "edit",
            label: "Edit",
            variant: "default",
            show: permissions.update_daily_batch_item,
            icon: <SquarePen {...ICON_ATTRS} />,

            action: () => {
              setFormData({
                type: "update",
                title: `Update`,
                description: "update batch item",
                id: data.id,
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_daily_batch_item,
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
          <BaseFilter filters={["branch_id"]} />
        </div>
        {permissions.create_daily_batch_item && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                type: "create",
                title: "Daily Production | Batch Item",
                description: "create a new batch item",
              })
            }
          >
            <Plus className="mr-2" />
            Add Batch Item
          </Button>
        )}
      </div>
      <div className="flex items-center mb-4 gap-1">
        <div className="max-w-sm">
          <AppDateRangePicker
            placeholder="Select a Sale Date Range"
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
      <AppStatus status={status} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
      <InventoryBatchItemCard
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
        <BatchItemForm
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
        loading={isPendingDeleteBatchItem}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteBatchItem(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-daily-batch-items-query"],
                });
                toast.success("BatchItem is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete BatchItem."
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
