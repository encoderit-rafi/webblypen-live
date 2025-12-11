"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
import SupplierForm from "./_component/SupplierForm";
import { SupplierSchemaType } from "./_types/supplier_types";
// import { GLOBAL_FORM_DATA } from "./_data/data";
import { GLOBAL_FORM_DATA, ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import { ActionsType, GlobalFormType } from "@/types/global";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetAllSuppliers } from "./_api/queries/useQueryGetAllSuppliers";
import { useMutationDeleteSupplier } from "./_api/mutations/useMutationDeleteSupplier";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useManageUrl } from "@/hooks/use-manage-url";
import AppStatus from "@/components/base/AppStatus";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import { useUserPermissions } from "@/hooks/use-user-permission";
import BaseDialog from "@/components/base/BaseDialog";

export default function Suppliers() {
  const permissions = useUserPermissions(PERMISSIONS.supplier);

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);

  const { data, status } = useQueryGetAllSuppliers({});
  type SuppliersAPIType = (typeof data.data)[number];

  const { getParams, setParams } = useManageUrl();
  const { page } = getParams;
  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  const { mutate: deleteSupplier, isPending: isPendingDeleteSupplier } =
    useMutationDeleteSupplier();
  const columns: ColumnDef<SuppliersAPIType>[] = [
    {
      header: "Supplier",
      accessorKey: "name",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Email",
      accessorKey: "email",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Contact Person",
      accessorKey: "contact_person",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "TIN",
      accessorKey: "tin_number",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "W Tax",
      accessorKey: "w_tax",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Address",
      accessorKey: "address",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Payment Info",
      accessorKey: "payment_info",
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
            show: permissions.update_supplier,
            icon: <SquarePen {...ICON_ATTRS} />,

            action: () => {
              setFormData({
                type: "update",
                title: `Update  | ${data.name}`,
                description: "update supplier",
                id: data.id,
                // buttonText: "update",
                // data: {
                //   ...data,
                //   id: data.id,
                //   branches: data.branches
                //     ? data.branches.map((branch: any) => ({
                //         id: String(branch.id),
                //         value: String(branch.id),
                //         label: branch.name,
                //       }))
                //     : [],
                // },
              });
              console.log("🚀 ~ Suppliers ~ setFormData:", setFormData);
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_supplier,
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
        <div className="max-w-sm">
          <AppSearch />
        </div>
        {permissions.create_supplier && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                type: "create",
                title: "Create",
                description: "create new supplier",
              })
            }
          >
            <Plus className="mr-2" />
            Add Supplier
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
      {/* <SupplierForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
        formData={formData}
      /> */}
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
        <SupplierForm
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
        loading={isPendingDeleteSupplier}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteSupplier(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-suppliers-query"],
                });
                toast.success("Supplier is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  console.error(
                    "Error deleting supplier:",
                    error.response?.data?.message
                  );
                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete supplier."
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
