"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
import BranchForm from "./_component/BranchForm";
// import { GLOBAL_FORM_DATA } from "./_data/data";
import { BranchSchemaType } from "./_types/branch_types";
import { ActionsType, GlobalFormType, OptionSchemaType } from "@/types/global";
import { GLOBAL_FORM_DATA, ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetAllBranches } from "./_api/queries/useQueryGetAllBranches";
import { useMutationDeleteBranch } from "./_api/mutations/useMutationDeleteBranch";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useMutationUpdateBranchStatus } from "./_api/mutations/useMutationUpdateBranchStatus";
import AppStatusToggle from "@/components/base/AppStatusToggle";
import { useManageUrl } from "@/hooks/use-manage-url";
import AppStatus from "@/components/base/AppStatus";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import { useUserPermissions } from "@/hooks/use-user-permission";
import BaseDialog from "@/components/base/BaseDialog";

export default function Branches() {
  const permissions = useUserPermissions(PERMISSIONS.branch);

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);
  const [branchID, setBranchID] = useState<string | number | null>(null);
  const { data, status } = useQueryGetAllBranches({});
  type BranchesAPIType = (typeof data.data)[number];

  const { mutate: deleteBranch, isPending: isPendingDeleteBranch } =
    useMutationDeleteBranch();

  const { mutate: updateBranchStatus, isPending: isPendingUpdateBranchStatus } =
    useMutationUpdateBranchStatus();

  function handelBranchStatusToggle(branch: BranchSchemaType) {
    const is_active = !branch.is_active;
    updateBranchStatus(
      { ...branch, is_active },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-branches-query"],
          });
          toast.success(
            `Branch ${is_active ? "activated" : "deactivated"} successfully!`
          );
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update Branch status."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      }
    );
  }
  const columns: ColumnDef<BranchesAPIType>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Code",
      accessorKey: "code",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Contact Person",
      accessorKey: "contact_person",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Active",
      accessorKey: "is_active",

      cell: (props) => {
        const data = props.cell.row.original;
        const branch = {
          id: data.id,
          status: props.getValue() as boolean,
        };
        return (
          <AppStatusToggle
            isLoading={branchID == branch.id && isPendingUpdateBranchStatus}
            isActive={props.getValue() as boolean}
            onToggle={() => {
              setBranchID(branch.id || null);
              handelBranchStatusToggle(data);
            }}
            disabled={!permissions.update_status_branch}
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
            show: permissions.update_branch,
            icon: <SquarePen {...ICON_ATTRS} />,

            action: () => {
              setFormData({
                type: "update",
                title: `Update  | ${data.name}`,
                description: "update branch",
                id: data?.id,
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_branch,
            icon: <Trash2 {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "delete",
                title: `Are you sure you?`,
                description: `Are you sure you want to delete ${data.name}? All your data will be removed permanently.`,
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
  const { getParams, setParams } = useManageUrl();
  const { page } = getParams;
  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="max-w-sm">
          <AppSearch />
        </div>
        {permissions.create_branch && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                type: "create",
                title: "Create",
                description: "create  new branch",
                id: "",
              })
            }
          >
            <Plus className="mr-2" />
            Add Branch
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
        <BranchForm
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
        loading={isPendingDeleteBranch}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteBranch(
            { id: formData.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-branches-query"],
                });
                toast.success("Branch is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  console.error(
                    "Error deleting branch.",
                    error.response?.data?.message
                  );
                  toast.error(
                    error.response?.data?.message || "Failed to delete branch."
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
