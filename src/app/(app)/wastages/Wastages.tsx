"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, SquarePen, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
import WastageForm from "./_component/WastageForm";
import { INITIAL_FORM_DATA } from "./_data/data";
// import { WastageFormType } from "./_types/wastage_types";
import { ActionsType, GlobalFormType } from "@/types/global";
import { GLOBAL_FORM_DATA, ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationDeleteWastage } from "./_api/mutations/useMutationDeleteWastage";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import AppStatusToggle from "@/components/base/AppStatusToggle";
import { useManageUrl } from "@/hooks/use-manage-url";
import AppStatus from "@/components/base/AppStatus";
import { useQueryGetAllWastages } from "./_api/queries/useQueryGetAllBWastages";
import { useUserPermissions } from "@/hooks/use-user-permission";
import { BaseFilter } from "@/components/base/BaseFilter";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import BaseDialog from "@/components/base/BaseDialog";

export default function Wastages() {
  const { getParams, setParams } = useManageUrl();
  const { page, wastage_date_from, wastage_date_to } = getParams;

  useEffect(() => {
    if (wastage_date_to || wastage_date_from) {
      setDateRange({
        from: new Date(wastage_date_from),
        to: new Date(wastage_date_to),
      });
      setParams({
        ...getParams,
        wastage_date_from: format(wastage_date_from, "yyyy-MM-dd"),
        wastage_date_to: format(wastage_date_to, "yyyy-MM-dd"),
      });
    }
  }, []);
  const permissions = useUserPermissions(PERMISSIONS.wastage);

  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);
  const { data, status } = useQueryGetAllWastages({});
  type WastagesAPIType = (typeof data.data)[number];

  const { mutate: deleteWastage, isPending: isPendingDeleteWastage } =
    useMutationDeleteWastage();

  const columns: ColumnDef<WastagesAPIType>[] = [
    {
      header: "Branch",
      accessorKey: "branch.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Product",
      accessorKey: "product.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Unit",
      accessorKey: "unit",
      cell: (props) => {
        const unit = props.getValue() as {
          id: number;
          name: string;
          code: string;
        };
        return `${unit.name} (${unit.code})`;
      },
    },

    {
      header: "Reason",
      accessorKey: "reason",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Date",
      accessorKey: "wastage_date",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Unit Price",
      accessorKey: "unit_price",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Total Price",
      accessorKey: "total_price",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Actions",
      cell: (props) => {
        const data = props.cell.row.original;

        const Actions = [
          {
            type: "edit",
            label: "Edit",
            variant: "default",
            show: permissions.update_wastage,
            icon: <SquarePen {...ICON_ATTRS} />,

            action: () => {
              setFormData({
                type: "update",
                title: `Update`,
                description: "update open wastage",
                id: data.id,
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_wastage,
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

  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="max-w-sm">
            <AppSearch />
          </div>
          <BaseFilter
            filters={[
              "branch_id",
              "product_id",
              "category_id",
              "sub_category_id",
              "unit_id",
            ]}
          />
        </div>
        {permissions.create_wastage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: "Create",
                description: "create a new wastage",
              })
            }
          >
            <Plus className="mr-2" />
            Add Wastage
          </Button>
        )}
      </div>
      <div className="flex items-center mb-4 gap-2">
        <div className="flex items-center gap-1">
          <div className="max-w-sm">
            <AppDateRangePicker
              placeholder="Select created wastage date"
              dateRange={dateRange}
              onChangeValue={(range) => {
                setDateRange(range);
                setParams({
                  ...getParams,
                  wastage_date_from: range.from
                    ? format(range.from, "yyyy-MM-dd")
                    : undefined,
                  wastage_date_to: range.to
                    ? format(range.to, "yyyy-MM-dd")
                    : undefined,
                });
              }}
              className="h-8"
            />
          </div>
          {!!wastage_date_from && !!wastage_date_to && (
            <X
              onClick={() => {
                setParams({}, ["wastage_date_to", "wastage_date_from"]);
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
            className: "max-w-full sm:max-w-7xl",
          },
        }}
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
      >
        <WastageForm
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
        loading={isPendingDeleteWastage}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteWastage(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-wastages-query"],
                });
                toast.success("Wastage is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  console.error(
                    "Error deleting wastage.",
                    error.response?.data?.message
                  );
                  toast.error(
                    error.response?.data?.message || "Failed to delete wastage."
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
