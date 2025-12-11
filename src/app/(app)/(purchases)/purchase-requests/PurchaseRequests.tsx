"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Bookmark, Eye, Plus, SquarePen, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import { AppPagination } from "@/components/base/AppPagination";
import {
  GLOBAL_FORM_DATA,
  ICON_ATTRS,
  PERMISSIONS,
  PR_STATUS_DATA,
} from "@/data/global_data";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { ActionsType, GlobalFormType } from "@/types/global";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import AppStatusToggleDropdown from "@/components/base/AppStatusToggleDropdown";
import AppStatus from "@/components/base/AppStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import PurchaseRequestForm from "./_component/PurchaseRequestForm";
import { useMutationDeletePurchaseRequest } from "./_api/mutations/useMutationDeletePurchaseRequest";
import { useQueryGetAllPurchaseRequests } from "./_api/queries/useQueryGetAllPurchaseRequests";
import { useMutationUpdatePurchaseRequestStatus } from "./_api/mutations/useMutationUpdatePurchaseRequestStatus";
import { Badge } from "@/components/ui/badge";
import AppDownloadButton from "@/components/base/AppDownloadButton";
import { useUserPermissions } from "@/hooks/use-user-permission";
import BaseDialog from "@/components/base/BaseDialog";
import PurchaseRequestCard from "@/components/base/cards/PurchaseRequestCard";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { BaseFilter } from "@/components/base/BaseFilter";
import PurchaseOrderForm from "../purchase-orders/_component/PurchaseOrderForm";
import StatusDropdown from "@/components/dropdowns/StatusDropdown";

export default function PurchaseRequests() {
  const queryClient = useQueryClient();
  const permissions = useUserPermissions([
    ...PERMISSIONS.purchase_request,
    ...PERMISSIONS.purchase,
  ]);

  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);

  const { data, status: statusPR } = useQueryGetAllPurchaseRequests({});
  type PurchaseRequestAPIType = (typeof data.data)[number];
  const {
    mutate: updatePurchaseRequestStatus,
    isPending: isPendingUpdatePurchaseRequestStatus,
  } = useMutationUpdatePurchaseRequestStatus();
  const [requestID, setRequestID] = useState<string | number | undefined>(
    undefined
  );
  const { getParams, setParams } = useManageUrl();
  const { page, created_at_from, created_at_to, status } = getParams;
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
  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  const {
    mutate: deletePurchaseRequest,
    isPending: isPendingDeletePurchaseRequest,
  } = useMutationDeletePurchaseRequest();

  const columns: ColumnDef<PurchaseRequestAPIType>[] = [
    {
      header: "PR Number",
      accessorKey: "pr_number",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Branch Name",
      accessorKey: "branch_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Requested by",
      accessorKey: "created_by_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "PR Date",
      accessorKey: "pr_date",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Product Count",
      accessorKey: "product_count",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Total Amount",
      accessorKey: "total_price",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "PO Created",
      accessorKey: "is_po_created",
      cell: (props) => {
        const isCreated = props.getValue();

        return (
          <Badge variant={`${isCreated ? "success" : "destructive"}`}>
            {isCreated ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status_label",
      cell: (props) => {
        const data = props.cell.row.original;

        const name = props.getValue() as string;

        return (
          <AppStatusToggleDropdown
            selectedValue={name}
            loading={
              requestID == data.id && isPendingUpdatePurchaseRequestStatus
            }
            options={PR_STATUS_DATA}
            onValueChange={(val) => {
              setRequestID(data.id);
              updatePurchaseRequestStatus(
                {
                  id: data.id,
                  status: val,
                },
                {
                  onSuccess() {
                    queryClient.invalidateQueries({
                      queryKey: ["get-purchase-requests-query"],
                    });
                    toast.success(
                      "Purchase request status updated successfully!"
                    );
                    setRequestID(undefined);
                  },
                  onError(error: any) {
                    if (isAxiosError(error)) {
                      toast.error(
                        error.response?.data?.message ||
                          "Failed to update purchase requestID status."
                      );
                    } else {
                      toast.error("Something went wrong.");
                    }
                  },
                }
              );
            }}
          />
        );
      },
    },
    {
      header: "Actions",
      cell: (props) => {
        const data = props.cell.row.original;
        console.log("👉 ~ PurchaseRequests ~ data:", data);
        const Actions = [
          {
            type: "view",
            label: "Check PR",
            variant: "default",
            show: permissions.show_purchase_request,
            icon: <Eye {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "view",
                title: `Check PR  | ${data.pr_number}`,
                description: "view product request",
                id: data.id,
              });
            },
          },
          {
            type: "update",
            label: "Update PR",
            variant: "default",
            show: permissions.update_purchase_request && data.status != 2,
            icon: <SquarePen {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "update",
                title: `Update PR  | ${data.pr_number}`,
                description: "update product request",
                id: data.id,
              });
            },
          },
          {
            type: "create",
            label: "Create PO",
            variant: "default",
            // show: true,
            show: !data.is_po_created && permissions.create_purchase,
            icon: <Bookmark {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "create_po",
                title: `Create PO  | ${data.pr_number}`,
                description: "create a new product request",
                id: data.id,
              });
            },
          },

          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_purchase_request,
            icon: <Trash2 {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "delete",
                title: "Are you sure?",
                description: `Are you sure you want to delete ${data.pr_number}? All your data will be removed permanently.`,
                id: data.id,
              });
            },
          },
        ] as const satisfies readonly ActionsType[];
        const visibleActions = Actions.filter((item) => item.show);
        return (
          <div>
            <AppActionsDropdown
              actions={visibleActions}
              disabled={!visibleActions.length}
            />
            <AppDownloadButton
              url={`/purchase-requests/generate/pdf/${data.id}`}
            />
          </div>
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
          <div className="border rounded-md">
            <StatusDropdown
              selected_id={status}
              props={{ placeholder: "Status" }}
              onValueChange={(val) => {
                if (!val.id) return;
                const isEqual = val.id == status;
                const statusID = isEqual ? "" : val.id;
                if (isEqual) {
                  setParams({}, ["status"]);
                  return;
                }

                setParams({
                  status: String(statusID),
                });
              }}
              status="PR_STATUS_DATA"
            />
          </div>
        </div>
        {permissions.create_purchase_request && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                type: "create",
                title: "Create",
                description: "create a new purchase request",
              })
            }
          >
            <Plus className="mr-2" />
            Add Purchase Request
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
      <AppStatus status={statusPR} is_data={!!data?.data?.length}>
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
        <PurchaseRequestForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>
      <BaseDialog
        title={formData?.title || ""}
        description={formData?.description || ""}
        component_props={{
          content: {
            className: "max-w-full sm:max-w-7xl",
          },
        }}
        open={formData.type === "create_po"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
      >
        <PurchaseOrderForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>
      <PurchaseRequestCard
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
        loading={isPendingDeletePurchaseRequest}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deletePurchaseRequest(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-purchase-requests-query"],
                });
                toast.success("Purchase Request is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error: any) {
                if (isAxiosError(error)) {
                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete Purchase Request."
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
