"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import { AppPagination } from "@/components/base/AppPagination";

import { SaleFormType, SaleSchemaType } from "./_types/sale_types";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationDeleteSale } from "./_api/Mutations/useMutationDeleteSale";
import SaleForm from "./_component/SaleForm";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { useQueryGetAllSales } from "./_api/queries/useQueryGetAllSales";
import AppStatus from "@/components/base/AppStatus";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import AppDateRangePicker, {
  DateRange,
} from "@/components/base/AppDateRangePicker";
import { useManageUrl } from "@/hooks/use-manage-url";
import { format } from "date-fns";
import RecipeDropdown from "@/components/dropdowns/RecipeDropdown";
import BranchDropdown from "@/components/dropdowns/BranchDropdown";
import RecipeCategoriesDropdown from "@/components/dropdowns/RecipeCategory";
import { BaseFilter } from "@/components/base/BaseFilter";
import BaseDialog from "@/components/base/BaseDialog";
import { GLOBAL_FORM_DATA } from "@/data/global_data";
import { GlobalFormType } from "@/types/global";

export default function Sales() {
  const { data: currentUser } = useQueryCurrentUser();
  const { setParams, getParams } = useManageUrl();
  const {
    page,
    recipe_id,
    sale_date_from,
    sale_date_to,
    branch_id,
    recipeCategory_id,
  } = getParams;
  const {
    permissions: currentUserPermissions,
    // manager_of_branches: currentUserManagerOfBranches,
  } = currentUser ?? {};
  const permissions = {
    create: currentUserPermissions?.["export_sale"],
    update: currentUserPermissions?.["import_sale"],
  };
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);
  const { mutate: deleteSale, isPending: isPendingDeleteSale } =
    useMutationDeleteSale();

  //Fetch data
  const { data, status } = useQueryGetAllSales({});

  console.log("Sales data", { data });

  const columns: ColumnDef<SaleSchemaType>[] = [
    {
      header: "Branch",
      accessorKey: "branch_name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Sale Date",
      accessorKey: "sale_date",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Sale Category",
      accessorKey: "sale_category",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Recipe Category",
      accessorKey: "recipe_category_name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Recipe",
      accessorKey: "recipe_name",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: (props) => props.getValue() as number,
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (props) => props.getValue() as number,
    },

    {
      header: "Total Amount",
      accessorKey: "total_amount",
      cell: (props) => props.getValue() as number,
    },

    {
      header: "Discount",
      accessorKey: "discount",
      cell: (props) => props.getValue() as number,
    },
    {
      header: "Net Amount",
      accessorKey: "net_amount",
      cell: (props) => props.getValue() as number,
    },
    // {
    //   header: "Customer Name",
    //   accessorKey: "customer_name",
    //   cell: (props) => props.getValue() as string,
    // },
    // {
    //   header: "Customer Phone",
    //   accessorKey: "customer_phone",
    //   cell: (props) => props.getValue() as string,
    // },
    // {
    //   header: "Customer Address",
    //   accessorKey: "customer_address",
    //   cell: (props) => props.getValue() as string,
    // },
    // {
    //   header: "Payment Method",
    //   accessorKey: "payment_method",
    //   cell: (props) => props.getValue() as string,
    // },
    // {
    //   header: "Status",
    //   accessorKey: "status",
    //   cell: (props) => props.getValue() as string,
    // },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <AppSearch />
          <BaseFilter
            filters={["branch_id", "recipe_id", "recipe_category_id"]}
          />
        </div>

        <div className="flex items-center gap-2">
          {permissions && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFormData({
                  type: "create",
                  title: "Import",
                  description: "import new sales.",
                })
              }
            >
              <Plus className="mr-2" />
              Import
            </Button>
          )}
          {permissions && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  // const queryString = new URLSearchParams(
                  //   Object.entries(getParams).filter(
                  //     ([_, v]) => v !== undefined
                  //   )
                  // ).toString();

                  const res = await api.get(`/sales/details/export`);
                  const { download_link, file_name } = res.data.data;

                  if (download_link) {
                    const link = document.createElement("a");
                    link.href = download_link;
                    link.setAttribute(
                      "download",
                      file_name || "sales-details.xlsx"
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  } else {
                    toast.error("Download link not found");
                  }
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to download file");
                }
              }}
            >
              <Download className="mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center mb-4 gap-2">
        <div className="flex items-center gap-1">
          <div className="max-w-sm">
            <AppDateRangePicker
              placeholder="Select sales date"
              dateRange={dateRange}
              onChangeValue={(range) => {
                setDateRange(range);
                setParams({
                  ...getParams,
                  sale_date_from: range.from
                    ? format(range.from, "yyyy-MM-dd")
                    : undefined,
                  sale_date_to: range.to
                    ? format(range.to, "yyyy-MM-dd")
                    : undefined,
                });
              }}
              className="h-8"
            />
          </div>
          {!!sale_date_from && !!sale_date_to && (
            <X
              onClick={() => {
                setParams({}, ["sale_date_to", "sale_date_from"]);
                setDateRange(undefined);
              }}
              className="size-4"
            />
          )}
        </div>
      </div>

      <AppStatus status={status} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />

        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
      {/* <SaleForm
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
        <SaleForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>
      {/* <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteSale}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteSale({id:formData.id}, {
            onSuccess() {
              queryClient.invalidateQueries({
                queryKey: ["get-sales-query"],
              });
              toast.success("sale is deleted successfully!");
              setFormData(GLOBAL_FORM_DATA);
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
      /> */}
    </div>
  );
}
