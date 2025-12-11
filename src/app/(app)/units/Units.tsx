"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
import UnitForm from "./_component/UnitForm";
import { INITIAL_FORM_DATA } from "./_data/data";
import { UnitFormType, UnitSchemaType } from "./_types/unit_types";
import { useQueryGetAllUnits } from "./_api/queries/useQueryGetAllUnits";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { ActionsType } from "@/types/global";
import { ICON_ATTRS } from "@/data/global_data";
import { useMutationDeleteUnit } from "./_api/mutations/useMutationDeleteUnit";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import AppStatusToggle from "@/components/base/AppStatusToggle";
import { useMutationUpdateUnitStatus } from "./_api/mutations/useMutationUpdateUnitStatus";
import AppStatus from "@/components/base/AppStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";

export default function Units() {
  const { data: currentUser } = useQueryCurrentUser();

  const {
    permissions: currentUserPermissions,
    // manager_of_branches: currentUserManagerOfBranches,
  } = currentUser ?? {};
  const permissions = {
    create: currentUserPermissions?.["create_unit"],
    update: currentUserPermissions?.["update_unit"],
    delete: currentUserPermissions?.["delete_unit"],
    update_status: currentUserPermissions?.["update_status_unit"],
  };
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UnitFormType>(INITIAL_FORM_DATA);
  const [unitID, setUnitID] = useState<string | number | null>(null);

  const { data, status } = useQueryGetAllUnits({});
  const { mutate: deleteUnit, isPending: isPendingDeleteUnit } =
    useMutationDeleteUnit();

  const { mutate: updateUnitStatus, isPending: isPendingUpdateUnitStatus } =
    useMutationUpdateUnitStatus();

  function handleUnitStatusToggle(unit: {
    id: string | number | undefined;
    is_active: boolean;
  }) {
    const is_active = unit.is_active;

    updateUnitStatus(
      {
        id: unit.id,
        is_active: !is_active,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-units-query"],
          });
          toast.success(
            `Unit ${!is_active ? "activated" : "deactivated"} successfully!`
          );
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update unit status."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      }
    );
  }

  const columns: ColumnDef<UnitSchemaType>[] = [
    {
      header: "Unit",
      accessorKey: "name",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Code",
      accessorKey: "code",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Active",
      accessorKey: "is_active",
      cell: (props) => {
        const data = props.cell.row.original;
        const unit = {
          id: data.id,
          is_active: !!Number(props.getValue()),
        };
        return (
          <AppStatusToggle
            isLoading={unitID == unit.id && isPendingUpdateUnitStatus}
            isActive={unit.is_active}
            onToggle={() => {
              setUnitID(unit.id || null);
              handleUnitStatusToggle(unit);
            }}
            disabled={!permissions.update_status}
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
            show: permissions.update,
            icon: <SquarePen {...ICON_ATTRS} />,

            action: () => {
              setFormData({
                type: "update",
                title: `Update  | ${data.name}`,
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
            show: permissions.delete,
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
            disabled={!visibleActions}
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
        {permissions.create && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: "Create new unit",
                buttonText: "create",
              })
            }
          >
            <Plus className="mr-2" />
            Add Unit
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

      <UnitForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        formData={formData}
      />

      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteUnit}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteUnit(
            { id: formData.data.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-units-query"],
                });
                toast.success("Unit deleted successfully!");
                setFormData(INITIAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  console.error(
                    "Error deleting unit.",
                    error.response?.data?.message
                  );
                  toast.error(
                    error.response?.data?.message || "Failed to delete unit."
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
