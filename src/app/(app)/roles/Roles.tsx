"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Lock, Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import {
  INITIAL_PERMISSION_FORM_DATA,
  INITIAL_ROLE_FORM_DATA,
} from "./_data/data";
import RoleForm from "./_component/RoleForm";
import { RoleFormType, RoleType } from "./_types/role_types";
import { useQueryGetAllRoles } from "./_api/queries/useQueryGetAllRoles";
import { useMutationDeleteRole } from "./_api/mutations/useMutationDeleteRole";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import { ICON_ATTRS } from "@/data/global_data";
import { ActionsType } from "@/types/global";
import PermissionForm from "./_component/PermissionForm";
import { PermissionFormType } from "./_types/permission_types";
import AppStatus from "@/components/base/AppStatus";

export default function Roles() {
  const [formData, setFormData] = useState<RoleFormType>(
    INITIAL_ROLE_FORM_DATA
  );
  const [permissionForm, setPermissionForm] = useState<PermissionFormType>(
    INITIAL_PERMISSION_FORM_DATA
  );
  const queryClient = useQueryClient();

  const { data, status } = useQueryGetAllRoles();
  const { mutate: deleteRole, isPending: isPendingDeleteRole } =
    useMutationDeleteRole();
  const columns: ColumnDef<RoleType>[] = [
    {
      header: "Role",
      accessorKey: "name",
      cell: (props) => {
        return <span className="capitalize">{props.getValue() as string}</span>;
      },
    },
    {
      header: "Permissions",
      accessorKey: "permission_count",
      cell: (props) => {
        const { permission_count = "-", total_permission_count = "-" } =
          props.row.original;
        return `${permission_count}/${total_permission_count}`;
      },
    },
    {
      header: "User Count",
      accessorKey: "user_count",
      cell: (props) => {
        const count = props.row.original.user_count ?? "0";

        return count;
      },
    },
    {
      header: "Actions",
      cell: (props) => {
        const data = props.cell.row.original;
        const Actions = [
          {
            type: "edit_role",
            label: "Edit Role",
            variant: "default",
            show: true,
            icon: <SquarePen {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "update",
                title: `Update role | ${data.name}`,
                buttonText: "update",
                data,
              });
            },
          },
          {
            type: "update_permissions",
            label: "Update Permissions",
            variant: "default",
            show: true,
            icon: <Lock {...ICON_ATTRS} />,
            action: () => {
              setPermissionForm({
                type: "permission",
                title: `Update Role Permissions | ${data.name}`,
                buttonText: "update",
                data: {
                  role: data.name,
                  permissions: data.permission_ids,
                },
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: data.deletable,
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
  // if (status === "pending") {
  //   return <div className="text-center">Loading...</div>;
  // } else if (status === "error") {
  //   return <div className="text-center">Error loading data</div>;
  // } else if (status == "success" && data.length === 0) {
  //   return <div className="text-center">No data found. Please create one</div>;
  // }

  return (
    <div>
      <div className="flex items-center justify-end mb-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setFormData({
              ...INITIAL_ROLE_FORM_DATA,
              type: "create",
              title: "Create new role",
              buttonText: "create",
            })
          }
        >
          <Plus className="mr-2" />
          Add Role
        </Button>
      </div>
      <AppStatus status={status} is_data={!!data?.length}>
        <AppTable data={data ?? []} columns={columns} />
      </AppStatus>
      <RoleForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(INITIAL_ROLE_FORM_DATA);
        }}
        formData={formData}
      />
      <PermissionForm
        open={permissionForm.type === "permission"}
        onOpenChange={() => {
          setPermissionForm(INITIAL_PERMISSION_FORM_DATA);
        }}
        formData={permissionForm}
      />
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteRole}
        onOpenChange={() => setFormData(INITIAL_ROLE_FORM_DATA)}
        onConfirmDelete={() => {
          deleteRole(formData.data, {
            onSuccess() {
              queryClient.invalidateQueries({ queryKey: ["get-roles-query"] });
              toast.success("Role is deleted successfully!");
              setFormData(INITIAL_ROLE_FORM_DATA);
            },
            onError(error) {
              if (isAxiosError(error)) {
                console.error(
                  "Error deleting role:",
                  error.response?.data?.message
                );
                toast.error(
                  error.response?.data?.message || "Failed to delete role."
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
