"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, SquarePen, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import { GLOBAL_FORM_DATA, ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { ActionsType, GlobalFormType } from "@/types/global";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import AppStatus from "@/components/base/AppStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import { useQueryGetAllOpenMarket } from "./_api/queries/useQueryGetAllOpenMarket";
import { useMutationDeleteOpenMarket } from "./_api/mutations/useMutationDeleteOpenMarket";
import OpenMarketForm from "./_component/OpenMarketForm";
import OpenMarketCard from "@/components/base/cards/OpenMarketCard";
import { useUserPermissions } from "@/hooks/use-user-permission";
import BaseDialog from "@/components/base/BaseDialog";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { BaseFilter } from "@/components/base/BaseFilter";
import { AppPagination } from "@/components/base/AppPagination";

export default function OpenMarket() {
  const queryClient = useQueryClient();
  const permissions = useUserPermissions(PERMISSIONS.open_market_purchase);
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);

  const { data: openMarket, status } = useQueryGetAllOpenMarket({});
  type OpenMarketAPIType = (typeof data.data.data)[number];
  const { data, meta } = openMarket?.data ?? {};
  console.log(`👉 ~ OpenMarket ~ { data, mete }:`, { data, meta });
  const { getParams, setParams } = useManageUrl();
  const {
    page,
    created_at_from,
    created_at_to,
    purchase_date_from,
    purchase_date_to,
  } = getParams;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [purchasePateRange, setPurchaseDateRange] = useState<
    DateRange | undefined
  >(undefined);
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
    if (purchase_date_to || purchase_date_from) {
      setPurchaseDateRange({
        from: new Date(purchase_date_from),
        to: new Date(purchase_date_to),
      });
      setParams({
        ...getParams,
        purchase_date_from: format(purchase_date_from, "yyyy-MM-dd"),
        purchase_date_to: format(purchase_date_to, "yyyy-MM-dd"),
      });
    }
  }, []);

  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  const { mutate: deleteOpenMarket, isPending: isPendingDeleteOpenMarket } =
    useMutationDeleteOpenMarket();

  const columns: ColumnDef<OpenMarketAPIType>[] = [
    {
      header: "OMP Number",
      accessorKey: "omp_number",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Branch",
      accessorKey: "branch.name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Supplier",
      accessorKey: "supplier.name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Purchase Date",
      accessorKey: "purchase_date",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Purchase Date",
      accessorKey: "purchase_date",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "VAT Amount",
      accessorKey: "vat_amount",
      cell: (props) => {
        const name = props.getValue() as string;

        return Number(name).toFixed(2);
      },
    },
    {
      header: "Total Amount",
      accessorKey: "total_amount",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
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
            show: permissions.view_open_market_purchase,
            icon: <Eye {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "view",
                title: `View`,
                description: "view open market",
                id: data?.id,
              });
            },
          },
          {
            type: "update",
            label: "Update",
            variant: "default",
            show: permissions.update_open_market_purchase,
            icon: <SquarePen {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "update",
                title: "Update",
                description: "update open market",
                id: data?.id,
              });
            },
          },

          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_open_market_purchase,
            icon: <Trash2 {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "delete",
                title: "Are you sure?",
                description: `Are you sure you want to delete? All your data will be removed permanently.`,
                id: data?.id,
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
          <BaseFilter filters={["branch_id", "supplier_id"]} />
        </div>
        {permissions.create_open_market_purchase && (
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
            Add Open Market
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
        <div className="flex items-center gap-1">
          <div className="max-w-sm">
            <AppDateRangePicker
              placeholder="Select purchase date"
              dateRange={purchasePateRange}
              onChangeValue={(range) => {
                setPurchaseDateRange(range);
                setParams({
                  ...getParams,
                  purchase_date_from: range.from
                    ? format(range.from, "yyyy-MM-dd")
                    : undefined,
                  purchase_date_to: range.to
                    ? format(range.to, "yyyy-MM-dd")
                    : undefined,
                });
              }}
              className="h-8"
            />
          </div>
          {!!purchase_date_from && !!purchase_date_to && (
            <X
              onClick={() => {
                setParams({}, ["purchase_date_from", "purchase_date_to"]);
                setPurchaseDateRange(undefined);
              }}
              className="size-4"
            />
          )}
        </div>
      </div>
      <AppStatus status={status} is_data={!!data?.length}>
        <AppTable data={data ?? []} columns={columns} />

        <AppPagination page={meta?.current_page} lastPage={meta?.last_page} />
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
        <OpenMarketForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>
      <OpenMarketCard
        title={formData.title || ""}
        open={formData.type === "view"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
        id={formData.id || ""}
      />
      <AppDeleteDialog
        title={formData.title}
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteOpenMarket}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteOpenMarket(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-open-markets-query"],
                });
                toast.success("Open market is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error: any) {
                if (isAxiosError(error)) {
                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete open market."
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
