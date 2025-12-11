"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
// import { TableCell } from "@/components/ui/table";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BrandForm from "./_component/BrandForm";
import { BrandFormType, BrandSchemaType } from "./_types/brand_types";
import { INITIAL_FORM_DATA } from "./_data/data";
import { ActionsType } from "@/types/global";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetAllBrands } from "./_api/queries/useQueryGetAllBrands";
import { useMutationDeleteBrand } from "./_api/Mutations/useMutationDeleteBrand";
import { ICON_ATTRS } from "@/data/global_data";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import AppStatusToggle from "@/components/base/AppStatusToggle";
import { useMutationUpdateBrandStatus } from "./_api/Mutations/useMutationUpdateBrandStatus";
import { useMutationUpdateBrandDefault } from "./_api/Mutations/useMutationUpdateBrandDefault";
import AppStatus from "@/components/base/AppStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import { getImageSrc } from "@/utils/getImageSrc";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import BrandCard from "@/components/base/cards/BrandCard";

export default function Brands() {
  const { data: currentUser } = useQueryCurrentUser();

  const {
    permissions: currentUserPermissions,
    // manager_of_branches: currentUserManagerOfBranches,
  } = currentUser ?? {};
  const permissions = {
    create: currentUserPermissions?.["create_brand"],
    update: currentUserPermissions?.["update_brand"],
    delete: currentUserPermissions?.["delete_brand"],
    update_status: currentUserPermissions?.["update_status_brand"],
  };
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<BrandFormType>(INITIAL_FORM_DATA);
  const [brandID, setBrandID] = useState<string | number | null>(null);
  const { data, status } = useQueryGetAllBrands({});
  const { mutate: deleteBrand, isPending: isPendingDeleteBrand } =
    useMutationDeleteBrand();

  const { mutate: updateBrandStatus, isPending: isPendingUpdateBrandStatus } =
    useMutationUpdateBrandStatus();

  const { mutate: updateBrandDefault, isPending: isPendingUpdateBrandDefault } =
    useMutationUpdateBrandDefault();

  function handelBrandStatusToggle(brand: BrandSchemaType) {
    console.log("🚀 ~ handelBrandStatusToggle ~ brand:", brand);
    const is_active = !brand.is_active;
    updateBrandStatus(
      {
        id: brand.id,
        status: is_active,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-brands-query"],
          });
          toast.success(
            `Brand ${is_active ? "activated" : "deactivated"} successfully!`
          );
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update Brand status."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      }
    );
  }

  const handelBrandDefaultToggle = (brand: BrandSchemaType) => {
    const is_default = !brand.is_default;
    updateBrandDefault(
      {
        id: brand.id,
        status: is_default,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-brands-query"],
          });
          toast.success(
            `Brand ${
              !is_default ? "set as default" : "removed from default"
            } successfully!`
          );
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ||
                "Failed to update Brand default status."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      }
    );
  };

  const columns: ColumnDef<BrandSchemaType>[] = [
    // {
    //   header: "Brand",
    //   accessorKey: "name",
    //   cell: (props) => (
    //     <>
    //       <div className="flex items-center gap-2">
    //         <Avatar className="size-6">
    //           <AvatarImage src="https://github.com/shadcn.png" />
    //           <AvatarFallback>CN</AvatarFallback>
    //         </Avatar>
    //         <span>{props.getValue() as string}</span>
    //       </div>
    //     </>
    //   ),
    // },
    {
      header: "Logo",
      accessorKey: "name",
      cell: (props) => {
        const data = props.cell.row.original;
        const name = String(data.name);

        const image = String(data.image);
        const img_src = getImageSrc(image) || "";
        const fallbackName = name.slice(0, 2);

        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={img_src} />
              <AvatarFallback className="uppercase size-6 text-xs">
                {fallbackName}
              </AvatarFallback>
            </Avatar>
            {/* <span>{name}</span> */}
          </div>
        );
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: (props) => {
        const data = props.cell.row.original;
        const name = props.getValue() as string;
        const image = String(data.image);
        // const img_src = getImageSrc(image) || "";
        // const fallbackName = name.slice(0, 2);

        return (
          <div className="flex items-center gap-2">
            {/* <Avatar className="size-6">
              <AvatarImage src={img_src} />
              <AvatarFallback className="uppercase size-6 text-xs">
                {fallbackName}
              </AvatarFallback>
            </Avatar> */}
            <span>{name}</span>
          </div>
        );
      },
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
            isLoading={brandID == branch.id && isPendingUpdateBrandStatus}
            isActive={props.getValue() as boolean}
            onToggle={() => {
              setBrandID(branch.id || null);
              handelBrandStatusToggle(data);
            }}
            disabled={!permissions.update_status}
          />
        );
      },
    },

    {
      header: "Default",
      accessorKey: "is_default",
      cell: (props) => {
        const data = props.cell.row.original;
        const brand = {
          id: data.id,
          is_default: props.getValue() as boolean,
        };

        return (
          <AppStatusToggle
            isLoading={brandID == brand.id && isPendingUpdateBrandDefault}
            isActive={brand.is_default}
            onToggle={() => {
              setBrandID(brand.id || null);
              handelBrandDefaultToggle(data);
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
            type: "view",
            label: "view",
            variant: "default",
            show: true,
            // show: data.status_label != "Received",
            icon: <Eye {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "view",
                title: `View  Stock Transfer`,
                buttonText: "",
                data: {
                  ...data,
                },
              });
            },
          },
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
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setFormData({
              ...INITIAL_FORM_DATA,
              type: "create",
              title: "Create new brand",
              buttonText: "create",
            })
          }
        >
          <Plus className="mr-2" />
          Add Brand
        </Button>
      </div>
      <AppStatus status={status} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
      <BrandCard
        title="Brand Details"
        open={formData.type === "view"}
        onOpenChange={() => {
          setFormData(INITIAL_FORM_DATA);
        }}
        formData={formData}
      />

      <BrandForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        formData={formData}
      />
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteBrand}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteBrand(formData.data, {
            onSuccess() {
              queryClient.invalidateQueries({
                queryKey: ["get-brands-query"],
              });
              toast.success("Brand deleted successfully!");
              setFormData(INITIAL_FORM_DATA);
            },
            onError(error) {
              if (isAxiosError(error)) {
                console.error(
                  "Error deleting brand:",
                  error.response?.data?.message
                );
                toast.error(
                  error.response?.data?.message || "Failed to delete brand."
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
