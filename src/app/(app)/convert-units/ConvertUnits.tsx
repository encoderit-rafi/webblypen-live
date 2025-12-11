"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import ConvertUnitForm from "./_component/ConvertUnitForm";
import {
  UnitConversionFormType,
  UnitConversionSchemaType,
} from "./_types/convert_unit_types";
import { INITIAL_FORM_DATA } from "./_data/data";
import { ActionsType } from "@/types/global";
import { ICON_ATTRS } from "@/data/global_data";

import { useMutationDeleteUnitConversion } from "./_api/Mutations/useMutationDeleteUnitConvert";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

import { useQueryGetAllUnitsConversions } from "./_api/queries/useQueryGetAllUnitsConversions";
import AppStatus from "@/components/base/AppStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";

export default function ConvertUnits() {
  const { data: currentUser } = useQueryCurrentUser();

  const { permissions: currentUserPermissions } = currentUser ?? {};
  const permissions = {
    create: currentUserPermissions?.["create_product_unit_conversion"],
    update: currentUserPermissions?.["update_product_unit_conversion"],
    delete: currentUserPermissions?.["delete_product_unit_conversion"],
  };
  const queryClient = useQueryClient();
  const [formData, setFormData] =
    useState<UnitConversionFormType>(INITIAL_FORM_DATA);

  const { data, status } = useQueryGetAllUnitsConversions({});
  const {
    mutate: deleteUnitConversion,
    isPending: isPendingDeleteUnitConversion,
  } = useMutationDeleteUnitConversion();
  const columns: ColumnDef<UnitConversionSchemaType>[] = [
    {
      header: "Product",
      accessorKey: "product.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Default Unit",
      accessorKey: "conversion_unit.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Unit",
      accessorKey: "base_unit.name",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Ratio",
      accessorKey: "conversion_factor",
      cell: (props) => props.getValue() as number,
    },
    {
      header: "Actions",
      cell: (props) => {
        const data = props.cell.row.original;
        console.log({ data });

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
                title: `Update | ${data.product_id.name}`,
                buttonText: "update",
                data,
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
                description: `Are you sure you want to delete conversion for ${data.id}?`,
                buttonText: "delete",
                data: data,
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
        {permissions.create && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: "Create new conversion unit",
                buttonText: "create",
                data: { ...INITIAL_FORM_DATA.data },
              })
            }
          >
            <Plus className="mr-2" />
            Add Convert Unit
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

      <ConvertUnitForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(INITIAL_FORM_DATA);
        }}
        formData={formData}
      />

      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteUnitConversion}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteUnitConversion(formData.data, {
            onSuccess() {
              queryClient.invalidateQueries({
                queryKey: ["get-Unit-Conversions-query"],
              });
              toast.success("Unit Conversion is deleted successfully!");
              setFormData(INITIAL_FORM_DATA);
            },
            onError(error) {
              if (isAxiosError(error)) {
                console.error(
                  "Error deleting unit conversion:",
                  error.response?.data?.message
                );
                toast.error(
                  error.response?.data?.message ||
                    "Failed to delete unit conversion."
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
