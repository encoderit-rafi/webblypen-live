"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
import InvoiceCategoryForm from "./_component/InvoiceCategoryForm";
import {
  InvoiceCategoryFormType,
  InvoiceCategorySchemaType,
} from "./_types/invoice_category_types";
import { useQueryGetAllInvoiceCategories } from "./_api/queries/useQueryGetAllInvoiceCategories";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { ActionsType } from "@/types/global";
import { ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import { useMutationDeleteInvoiceCategory } from "./_api/mutations/useMutationDeleteInvoiceCategory";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import AppStatusToggle from "@/components/base/AppStatusToggle";
import { INITIAL_FORM_DATA } from "./_data/data";
import { useMutationUpdateInvoiceCategoryStatus } from "./_api/mutations/useMutationUpdateInvoiceCategoryStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import AppStatus from "@/components/base/AppStatus";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import { useUserPermissions } from "@/hooks/use-user-permission";

export default function InvoiceCategories() {
  const permissions = useUserPermissions(PERMISSIONS.invoice_category);

  const queryClient = useQueryClient();
  const [formData, setFormData] =
    useState<InvoiceCategoryFormType>(INITIAL_FORM_DATA);
  const [categoryID, setCategoryID] = useState<string | number | null>(null);
  const { data, status } = useQueryGetAllInvoiceCategories({});
  const { getParams, setParams } = useManageUrl();
  const { page } = getParams;
  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  const { mutate: deleteInvoiceCategory, isPending: isPendingDeleteCategory } =
    useMutationDeleteInvoiceCategory();

  const {
    mutate: updateCategoryStatus,
    isPending: isPendingUpdateCategoryStatus,
  } = useMutationUpdateInvoiceCategoryStatus();
  function handleCategoryStatusToggle(category: {
    id: string | number | undefined;
    is_active: boolean;
  }) {
    updateCategoryStatus(
      {
        id: category.id,
        status: !category.is_active,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-invoice-categories-query"],
          });
          toast.success(
            `Invoice Category ${
              !category.is_active ? "activated" : "deactivated"
            } successfully!`
          );
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ||
                "Failed to update invoice category status."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      }
    );
  }

  const columns: ColumnDef<InvoiceCategorySchemaType>[] = [
    {
      header: "Category",
      accessorKey: "name",
      cell: (props) => (
        <>
          {/* <Avatar className="size-6">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>IC</AvatarFallback>
          </Avatar> */}
          <span>{props.getValue() as string}</span>
        </>
      ),
    },
    {
      header: "Active",
      accessorKey: "is_active",
      cell: (props) => {
        const data = props.cell.row.original;
        const category = {
          id: data.id,
          is_active: !!Number(props.getValue()),
        };
        return (
          <AppStatusToggle
            isLoading={
              categoryID == category.id && isPendingUpdateCategoryStatus
            }
            isActive={category.is_active}
            onToggle={() => {
              setCategoryID(category.id || null);
              handleCategoryStatusToggle(category);
            }}
            disabled={!permissions.update_status_invoice_category}
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
            type: "edit",
            label: "Edit",
            variant: "default",
            show: permissions.update_invoice_category,
            icon: <SquarePen {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "update",
                title: `Update | ${data.name}`,
                buttonText: "update",
                data: {
                  ...data,
                  is_active: Boolean(data.is_active),
                },
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_invoice_category,
            icon: <Trash2 {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "delete",
                description: `Are you sure you want to delete ${data.name}? All your data will be removed permanently.`,
                buttonText: "delete",
                data,
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
        <div className="max-w-sm">
          <AppSearch />
        </div>
        {permissions.create_invoice_category && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: "Create new invoice category",
                buttonText: "create",
              })
            }
          >
            <Plus className="mr-2" />
            Add Invoice Category
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

      <InvoiceCategoryForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        formData={formData}
      />

      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteCategory}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteInvoiceCategory(formData.data, {
            onSuccess() {
              queryClient.invalidateQueries({
                queryKey: ["get-invoice-categories-query"],
              });
              toast.success("Invoice category deleted successfully!");
              setFormData(INITIAL_FORM_DATA);
            },
            onError(error) {
              if (isAxiosError(error)) {
                toast.error(
                  error.response?.data?.message ||
                    "Failed to delete invoice category."
                );
              } else {
                toast.error("Something went wrong.");
              }
            },
          });
        }}
      />
    </div>
  );
}
