"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, SquarePen, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import { TableCell } from "@/components/ui/table";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
import { InvoiceSchemaType } from "./_types/invoices_types";
// import { GLOBAL_FORM_DATA } from "./_data/data";
import InvoiceForm from "./_component/InvoiceForm";
import {
  GLOBAL_FORM_DATA,
  ICON_ATTRS,
  INVOICE_STATUS_DATA,
  PERMISSIONS,
} from "@/data/global_data";
import { ActionsType, GlobalFormType } from "@/types/global";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetAllInvoices } from "./_api/queries/useQueryGetAllInvoices";
import { useMutationDeleteInvoice } from "./_api/mutations/useMutationDeleteInvoice";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import AppStatus from "@/components/base/AppStatus";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import AppStatusToggleDropdown from "@/components/base/AppStatusToggleDropdown";
import { useMutationUpdateInvoicePaymentStatus } from "./_api/mutations/useMutationUpdateInvoicePaymentStatus";
import InvoiceCard from "@/components/base/cards/InvoiceCard";
import { useUserPermissions } from "@/hooks/use-user-permission";
import { BaseFilter } from "@/components/base/BaseFilter";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { DateRange } from "react-day-picker";
import { useManageUrl } from "@/hooks/use-manage-url";
import { format } from "date-fns";
import BaseDialog from "@/components/base/BaseDialog";
import { useQueryGetAllInvoiceCategoriesDropdown } from "./_api/queries/useQueryGetAllInvoiceCategoriesDropdown";
import StatusDropdown from "@/components/dropdowns/StatusDropdown";

export default function InvoicesAndPayments() {
  const { getParams, setParams } = useManageUrl();
  const {
    status,
    invoice_date_from,
    invoice_date_to,
    due_date_from,
    due_date_to,
  } = getParams;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [dueDateRange, setDueDateRange] = useState<DateRange | undefined>(
    undefined
  );
  const permissions = useUserPermissions(PERMISSIONS.invoice);

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);
  const { data, status: statusI } = useQueryGetAllInvoices({});
  const { data: invoiceCategories, isLoading: isLoadingInvoiceCategories } =
    useQueryGetAllInvoiceCategoriesDropdown({});
  const { mutate: deleteInvoice, isPending: isPendingDeleteInvoice } =
    useMutationDeleteInvoice();
  const {
    mutate: updateInvoicePaymentStatus,
    isPending: isPendingUpdateInvoicePaymentStatus,
  } = useMutationUpdateInvoicePaymentStatus();
  const [invoiceID, setInvoiceID] = useState<string | number | undefined>(
    undefined
  );
  const columns: ColumnDef<InvoiceSchemaType>[] = [
    {
      header: "Invoice ",
      accessorKey: "invoice_number",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Supplier",
      accessorKey: "supplier.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Payment Info",
      accessorKey: "payment_info",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Invoice Date",
      accessorKey: "invoice_date",
      cell: (props) =>
        new Date(props.getValue() as string).toLocaleDateString(),
    },
    {
      header: "Due Date",
      accessorKey: "due_date",
      cell: (props) =>
        new Date(props.getValue() as string).toLocaleDateString(),
    },

    // {
    //   header: "VAT",
    //   accessorKey: "vat",
    //   cell: (props) => props.getValue() as number,
    // },
    {
      header: "Amount",
      accessorKey: "total_amount",
      cell: (props) => props.getValue() as number,
    },

    // {
    //   header: "Note",
    //   accessorKey: "note",
    //   cell: (props) => props.getValue() as string,
    // },
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
              invoiceID == data.id && isPendingUpdateInvoicePaymentStatus
            }
            options={INVOICE_STATUS_DATA}
            disabled={!permissions?.update_status_invoice}
            onValueChange={(val) => {
              // console.log("🚀 ~ val:", val);
              setInvoiceID(data.id);
              updateInvoicePaymentStatus(
                {
                  id: data.id || "",
                  status: val,
                },
                {
                  onSuccess() {
                    queryClient.invalidateQueries({
                      queryKey: ["get-invoices-query"],
                    });
                    toast.success("Invoice status updated successfully!");
                    setInvoiceID(undefined);
                  },
                  onError(error) {
                    if (isAxiosError(error)) {
                      toast.error(
                        error.response?.data?.message ||
                          "Failed to update invoice status."
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
        console.log("👉 ~ InvoicesAndPayments ~ data:", data);
        const Actions = [
          {
            type: "view",
            label: "View",
            variant: "default",
            show: permissions.view_invoice,
            icon: <Eye {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "view",
                title: `View`,
                description: "view invoices and payments",
                id: data.id,
              });
            },
          },
          {
            type: "edit",
            label: "Edit",
            variant: "default",
            show: permissions.update_invoice && data.status != 2,
            icon: <SquarePen {...ICON_ATTRS} />,

            action: () => {
              setFormData({
                type: "update",
                title: `Update  | ${data.invoice_number}`,
                description: "update invoices and payments",
                id: data.id,
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_invoice,
            icon: <Trash2 {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "delete",
                title: `Are you sure?`,
                description: `Are you sure you want to delete ${data.invoice_number}? All your data will be removed permanently.`,
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
              status="INVOICE_STATUS_DATA"
            />
          </div>
        </div>
        {permissions.create_invoice && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...GLOBAL_FORM_DATA,
                type: "create",
                title: "Create",
                description: "create new invoice",
                id: "",
              })
            }
          >
            <Plus className="mr-2" />
            Add Invoice
          </Button>
        )}
      </div>
      <div className="flex items-center mb-4 gap-2">
        <div className="flex items-center gap-1">
          <div className="max-w-sm">
            <AppDateRangePicker
              placeholder="Select invoice date"
              dateRange={dateRange}
              onChangeValue={(range) => {
                setDateRange(range);
                setParams({
                  ...getParams,
                  invoice_date_from: range.from
                    ? format(range.from, "yyyy-MM-dd")
                    : undefined,
                  invoice_date_to: range.to
                    ? format(range.to, "yyyy-MM-dd")
                    : undefined,
                });
              }}
              className="h-8"
            />
          </div>
          {!!invoice_date_from && !!invoice_date_to && (
            <X
              onClick={() => {
                setParams({}, ["invoice_date_to", "invoice_date_from"]);
                setDateRange(undefined);
              }}
              className="size-4"
            />
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="max-w-sm">
            <AppDateRangePicker
              placeholder="Select due date"
              dateRange={dueDateRange}
              onChangeValue={(range) => {
                setDueDateRange(range);
                setParams({
                  ...getParams,
                  due_date_from: range.from
                    ? format(range.from, "yyyy-MM-dd")
                    : undefined,
                  due_date_to: range.to
                    ? format(range.to, "yyyy-MM-dd")
                    : undefined,
                });
              }}
              className="h-8"
            />
          </div>
          {!!due_date_from && !!due_date_to && (
            <X
              onClick={() => {
                setParams({}, ["due_date_from", "due_date_to"]);
                setDueDateRange(undefined);
              }}
              className="size-4"
            />
          )}
        </div>
      </div>
      <AppStatus status={statusI} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
      {/* <InvoiceForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
        formData={formData}
      /> */}
      <InvoiceCard
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
        <InvoiceForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>
      {/* <InvoiceCard
        title={formData.title || ""}
        open={formData.type === "view"}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        formData={formData}
      /> */}
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteInvoice}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteInvoice(
            { id: formData.id || "" },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-invoices-query"],
                });
                toast.success("Invoice is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  console.error(
                    "Error deleting invoice:",
                    error.response?.data?.message
                  );
                  toast.error(
                    error.response?.data?.message || "Failed to delete invoice."
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
