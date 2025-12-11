"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Download, Eye, SquarePen, Trash2, X } from "lucide-react";
import AppTable from "@/components/base/AppTable";
import { AppPagination } from "@/components/base/AppPagination";
import {
  GLOBAL_FORM_DATA,
  ICON_ATTRS,
  PERMISSIONS,
  PO_STATUS_DATA,
} from "@/data/global_data";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationDeletePurchaseOrder } from "./_api/mutations/useMutationDeletePurchaseOrder";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { ActionsType, GlobalFormType } from "@/types/global";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
// import { GLOBAL_FORM_DATA } from "./_data/data";
import { useManageUrl } from "@/hooks/use-manage-url";
import AppStatusToggleDropdown from "@/components/base/AppStatusToggleDropdown";
import { useMutationUpdatePurchaseOrderStatus } from "./_api/mutations/useMutationUpdatePurchaseOrderStatus";
import { useQueryGetAllPurchaseOrders } from "./_api/queries/useQueryGetAllPurchaseOrders";
// import { PurchaseOrderFormType } from "./_types/purchase_order_types";
import { useQuerySendMailPurchaseOrder } from "./_api/queries/useQuerySendMailPurchaseOrder";
import AppStatus from "@/components/base/AppStatus";
// import { downloadFile } from "@/utils/generatePdf";
import api from "@/lib/axios";
// import { useQueryCurrentUser } from "../../users/_api/queries/useQueryCurrentUser";
import PurchaseOrderForm from "./_component/PurchaseOrderForm";
// import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import PurchaseOrderCard from "@/app/(app)/(purchases)/purchase-orders/_component/PurchaseOrderCard";
import { useQueryCurrentUser } from "../../users/_api/queries/useQueryCurrentUser";
import AppDownloadButton from "@/components/base/AppDownloadButton";
import { useUserPermissions } from "@/hooks/use-user-permission";
import BaseDialog from "@/components/base/BaseDialog";
import { BaseFilter } from "@/components/base/BaseFilter";
import { format } from "date-fns";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { DateRange } from "react-day-picker";
import StatusDropdown from "@/components/dropdowns/StatusDropdown";
export default function PurchaseOrders() {
  const queryClient = useQueryClient();
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
  const permissions = useUserPermissions([...PERMISSIONS.purchase]);
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);
  const { data, status: statusPO } = useQueryGetAllPurchaseOrders({});
  console.log("🚀 ~ PurchaseOrders ~ data:", data);
  type PurchaseOrderAPIType = (typeof data.data)[number];

  const {
    mutate: deletePurchaseOrder,
    isPending: isPendingDeletePurchaseOrder,
  } = useMutationDeletePurchaseOrder();
  const [mailID, setMailID] = useState<string | number | null>(null);
  const { refetch: sendMail, isSuccess: isSuccessSendMail } =
    useQuerySendMailPurchaseOrder({
      enabled: !!mailID,
      id: mailID,
    });
  console.log("🚀 ~ PurchaseOrders ~ data:", data);

  const {
    mutate: updatePurchaseOrderStatus,
    isPending: isPendingUpdatePurchaseOrderStatus,
  } = useMutationUpdatePurchaseOrderStatus();
  const [orderID, setOrderID] = useState<string | number | undefined>(
    undefined
  );
  useEffect(() => {
    if (mailID) {
      sendMail();
    }
  }, [mailID]);
  useEffect(() => {
    if (isSuccessSendMail) {
      toast.success("Email send successfully.");
      setMailID(null);
    }
  }, [isSuccessSendMail]);
  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);

  const handleDownload = async (id: string | number) => {
    try {
      const url = `/purchases/generate/pdf/${id}`;
      const res = await api.get(url);

      if (!res.data?.data?.url) {
        toast.error("No data available");
        return;
      }

      const { url: download_Link } = res.data.data;

      // Open in a new tab instead of downloading
      window.open(download_Link, "_blank");
      // downloadFile(fileName, download_Link);
    } catch (error) {
      console.error(error);
      toast.error("No data available");
    }
  };

  const columns: ColumnDef<PurchaseOrderAPIType>[] = [
    {
      header: "PO Number",
      accessorKey: "po_number",
      cell: (props) => {
        const name = props.getValue() as string;

        return (
          <div className="flex items-center gap-3 whitespace-nowrap">
            {name}
            <Copy
              className="size-4"
              onClick={() => {
                navigator.clipboard.writeText(name);
                toast.success(`${name} copied`);
              }}
            />
          </div>
        );
      },
    },
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
      header: "Supplier Name",
      accessorKey: "supplier_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },

    {
      header: "Expected Delivery Date",
      accessorKey: "expected_delivery_date",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Received Date",
      accessorKey: "received_date",
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
      header: "Product Count",
      accessorKey: "product_count",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Requested By",
      accessorKey: "requested_by_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "PR Created By",
      accessorKey: "pr_created_by_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
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
      header: "Status",
      accessorKey: "status_label",
      cell: (props) => {
        const data = props.cell.row.original;

        const name = props.getValue() as string;

        return (
          <AppStatusToggleDropdown
            selectedValue={name}
            loading={orderID == data.id && isPendingUpdatePurchaseOrderStatus}
            options={PO_STATUS_DATA}
            onValueChange={(val) => {
              // console.log("🚀 ~ val:", val);
              setOrderID(data.id);
              updatePurchaseOrderStatus(
                {
                  id: data.id,
                  status: val,
                },
                {
                  onSuccess() {
                    queryClient.invalidateQueries({
                      queryKey: ["get-purchase-orders-query"],
                    });
                    toast.success(
                      "Purchase order status updated successfully!"
                    );
                    setOrderID(undefined);
                  },
                  onError(error) {
                    if (isAxiosError(error)) {
                      toast.error(
                        error.response?.data?.message ||
                          "Failed to update purchase order status."
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
        const Actions = [
          {
            type: "view",
            label: "Received Products",
            variant: "default",
            show: data.status == 3 && permissions.show_purchase,
            icon: <Eye {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "view",
                title: `Received Products`,
                description: `view received products`,
                id: data.id,
              });
            },
          },
          {
            type: "edit",
            label: "Update PO",
            variant: "default",
            show: data.status == 1 && permissions.update_purchase,
            icon: <SquarePen {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "update_po",
                title: `Update PO  | ${data.pr_number}`,
                description: "update purchase order",
                id: data.id,
              });
            },
          },
          {
            type: "default",
            label: "Download PO Pdf",
            variant: "default",
            show: true,
            icon: <Download {...ICON_ATTRS} />,
            action: () => {
              handleDownload(data.id);
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: data.status == 1 && permissions.delete_purchase,

            icon: <Trash2 {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "delete",
                title: "Are you sure?",
                description: `Are you sure you want to delete ${data.po_number}? All your data will be removed permanently.`,
                id: data.purchase_request_id,
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
            <AppDownloadButton url={`/purchases/generate/pdf/${data.id}`} />
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
          <BaseFilter
            filters={[
              "branch_id",
              "supplier_id",
              "approved_by",
              "received_by",
              "requested_by",
            ]}
          />
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
              status="PO_STATUS_DATA"
            />
          </div>
        </div>
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
      <AppStatus status={statusPO} is_data={!!data?.data?.length}>
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
        open={formData.type === "create_po" || formData.type === "update_po"}
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
      <PurchaseOrderCard
        title={formData.title || ""}
        open={formData.type === "view"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
        type={formData.type || ""}
        id={formData.id || ""}
      />
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeletePurchaseOrder}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deletePurchaseOrder(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-purchase-orders-query"],
                });
                toast.success("Purchase order is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete purchase order."
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
