"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
// import { TableCell } from "@/components/ui/table";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CostCenterForm from "./_component/CostCenterForm";
import { INITIAL_FORM_DATA } from "./_data/data";
import { CostCenterFormType, CostCenterSchemaType } from "./_types/cost-center";
import { ActionsType, OptionSchemaType } from "@/types/global";
import { ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetAllCostCenters } from "./_api/queries/useQueryGetAllCostCenters";
import { useMutationDeleteCostCenter } from "./_api/mutations/useMutationDeleteCostCenter";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import { toast } from "sonner";
import { isAxiosError } from "axios";
// import { useMutationUpdateCostCenterStatus } from "./_api/mutations/useMutationUpdateCostCenterStatus";
// import AppStatusToggle from "@/components/base/AppStatusToggle";
// import { useMutationUpdateCostCenterDefault } from "./_api/mutations/useMutationUpdateCostCenterDefault";
import { useManageUrl } from "@/hooks/use-manage-url";
import AppStatus from "@/components/base/AppStatus";
// import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import { useUserPermissions } from "@/hooks/use-user-permission";

export default function CostCenter() {
  const permissions = useUserPermissions(PERMISSIONS.cost_center);

  // const { data: currentUser } = useQueryCurrentUser();
  // const { permissions: currentUserPermissions } = currentUser ?? {};
  // const permissions = {
  //   create: currentUserPermissions?.["create_costCenter"],
  //   update: currentUserPermissions?.["update_costCenter"],
  //   delete: currentUserPermissions?.["delete_costCenter"],
  //   update_status: currentUserPermissions?.["update_status_costCenter"],
  // };
  const queryClient = useQueryClient();

  const [formData, setFormData] =
    useState<CostCenterFormType>(INITIAL_FORM_DATA);
  const [costCenterID, setCostCenterID] = useState<string | number | null>(
    null
  );
  const { data, status } = useQueryGetAllCostCenters({});
  type CostCenterAPIType = (typeof data.data)[number];

  const { mutate: deleteCostCenter, isPending: isPendingDeleteCostCenter } =
    useMutationDeleteCostCenter();

  // const { mutate: updateCostCenterStatus, isPending: isPendingUpdateCostCenterStatus } =
  //   useMutationUpdateCostCenterStatus();

  // function handelCostCenterStatusToggle(costCenter: CostCenterSchemaType) {
  //   const is_active = !costCenter.is_active;
  //   updateCostCenterStatus(
  //     { ...costCenter, is_active },
  //     {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries({
  //           queryKey: ["get-cost-centers-query"],
  //         });
  //         toast.success(
  //           `CostCenter ${is_active ? "activated" : "deactivated"} successfully!`
  //         );
  //       },
  //       onError: (error) => {
  //         if (isAxiosError(error)) {
  //           toast.error(
  //             error.response?.data?.message || "Failed to update CostCenter status."
  //           );
  //         } else {
  //           toast.error("Something went wrong.");
  //         }
  //       },
  //     }
  //   );
  // }
  const columns: ColumnDef<CostCenterAPIType>[] = [
    {
      header: "Name",
      accessorKey: "name",
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
            // show: true,
            show: permissions.update_cost_center,
            icon: <SquarePen {...ICON_ATTRS} />,

            action: () => {
              setFormData({
                type: "update",
                title: `Update  | ${data.name}`,
                buttonText: "update",
                // data: {
                //   ...data,
                //   manager: data.manager
                //     ? {
                //         id: String(data.manager.id),
                //         value: String(data.manager.id),
                //         label: data.manager.name,
                //       }
                //     : null,
                //   suppliers: Array.isArray(data.suppliers)
                //     ? data.suppliers.map((supplier: OptionSchemaType) => ({
                //         id: String(supplier.id),
                //         value: String(supplier.id),
                //         label: supplier.name,
                //       }))
                //     : [],
                //   costCenter_type: {
                //     id: String(data.costCenterType.id),
                //     value: String(data.costCenterType.name),
                //     label: data.costCenterType.name,
                //   },
                // },
                data,
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            // show: true,
            show: permissions.delete_cost_center,
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

        {permissions.create_cost_center && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: "Create new costCenter",
                buttonText: "create",
              })
            }
          >
            <Plus className="mr-2" />
            Add cost center
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
      <CostCenterForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(INITIAL_FORM_DATA);
        }}
        formData={formData}
      />
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteCostCenter}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteCostCenter(
            { id: formData.data.id },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-cost-centers-query"],
                });
                toast.success("CostCenter is deleted successfully!");
                setFormData(INITIAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  console.error(
                    "Error deleting costCenter.",
                    error.response?.data?.message
                  );
                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete costCenter."
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
