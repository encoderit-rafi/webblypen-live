"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import { AppPagination } from "@/components/base/AppPagination";
import InventoryCountForm from "./_component/InventoryCountForm";
import { InventoryCountFormType } from "./_types/inventory_count_types";
import { INITIAL_FORM_DATA } from "./_data/data";
import { useQueryClient } from "@tanstack/react-query";
import AppStatus from "@/components/base/AppStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import { useQueryCurrentUser } from "../../users/_api/queries/useQueryCurrentUser";
import { useQueryGetAllInventoryCounts } from "./_api/queries/useQueryGetAllInventoryCounts";
import ProductDropdown from "@/components/dropdowns/ProductDropdown";
import UnitDropdown from "@/components/dropdowns/UnitDropdown";
import BrandDropdown from "@/components/dropdowns/BrandDropdown";
import BranchDropdown from "@/components/dropdowns/BranchDropdown";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useUserPermissions } from "@/hooks/use-user-permission";
import { PERMISSIONS } from "@/data/global_data";
import CategoryDropdown from "@/components/dropdowns/CategoryDropdown";
import { BaseFilter } from "@/components/base/BaseFilter";

export default function InventoryCounts() {
  const { setParams, getParams } = useManageUrl();
  const {
    page,
    product_id,
    unit_id,
    brand_id,
    branch_id,
    physical_count_date_from,
    physical_count_date_to,
    category_id,
    sub_category_id,
  } = getParams;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    return !!physical_count_date_from && !!physical_count_date_to
      ? {
          from: new Date(physical_count_date_from),
          to: new Date(physical_count_date_to),
        }
      : undefined;
  });
  // const { permissions: currentUserPermissions } = currentUser ?? {};
  // const permissions = {
  //   create: currentUserPermissions?.["create_recipe"],
  //   update: currentUserPermissions?.["update_recipe"],
  //   delete: currentUserPermissions?.["delete_recipe"],
  //   update_status: currentUserPermissions?.["update_status_recipe"],
  // };
  const [formData, setFormData] =
    useState<InventoryCountFormType>(INITIAL_FORM_DATA);
  const { data, status } = useQueryGetAllInventoryCounts({});
  type InventoryCountsAPIType = (typeof data.data)[number];

  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  const columns: ColumnDef<InventoryCountsAPIType>[] = [
    {
      header: "Branch",
      accessorKey: "branch.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Code",
      accessorKey: "code",
      cell: (props) => {
        const product = props.cell.row.original.product;

        return product?.code;
      },
    },
    {
      header: "Generic Name",
      accessorKey: "product_generic",
      cell: (props) => {
        const data = props.cell.row.original.product.product_generic;

        return data?.name;
      },
    },
    {
      header: "Category",
      accessorKey: "category.name",
      cell: (props) => {
        const data = props.cell.row.original.product.category;

        return data?.name;
      },
    },
    {
      header: "Sub Category",
      accessorKey: "sub_category",
      cell: (props) => {
        const data = props.cell.row.original.product.sub_category;

        return data?.name;
      },
    },
    {
      header: "Product",
      accessorKey: "product.name",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Unit Price",
      accessorKey: "unit_price",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: (props) => {
        const quantity = props.getValue() as string;
        return quantity;
      },
    },
    {
      header: "Unit",
      accessorKey: "unit",
      cell: (props) => {
        // const data = props.cell.row.original.product;
        const data = props.cell.row.original.unit;
        return `${data.name} (${data.code})`;
      },
    },

    // {
    //   header: "Avg Price",
    //   accessorKey: "avg_price",
    //   cell: (props) => props.getValue() as string,
    // },

    {
      header: "Actual Count",
      accessorKey: "physical_total_quantity",
      // cell: (props) => {
      //   const physical_counts = props.getValue() as {
      //     id: 10;
      //     inventory_count_id: number;
      //     product_id: number;
      //     unit: {
      //       id: number | string;
      //       name: number | string;
      //       code: number | string;
      //     };

      //     default_unit_id: number;
      //     quantity: number;
      //     count_date: string;
      //     default_unit_quantity: number;
      //   }[];

      //   return physical_counts.length > 0 ? (
      //     <AppTable
      //       data={physical_counts ?? []}
      //       columns={[
      //         {
      //           header: "Quantity",
      //           accessorKey: "quantity",
      //           cell: (props) => props.getValue() as string,
      //         },
      //         {
      //           header: "Unit",
      //           accessorKey: "unit",
      //           cell: (props) => {
      //             const unit = props.getValue<{
      //               name: string;
      //               code: string;
      //             }>();
      //             return (
      //               <span>
      //                 {unit.name}({unit.code})
      //               </span>
      //             );
      //           },
      //         },
      //         {
      //           header: "Updated at",
      //           accessorKey: "count_date",
      //           cell: (props) => props.getValue() as string,
      //         },
      //       ]}
      //     />
      //   ) : null;
      // },
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Physical Count",
      accessorKey: "physical_counts",
      cell: (props) => {
        const physical_counts = props.getValue() as {
          id: 10;
          inventory_count_id: number;
          product_id: number;
          unit: {
            id: number | string;
            name: number | string;
            code: number | string;
          };

          default_unit_id: number;
          quantity: number;
          count_date: string;
          default_unit_quantity: number;
        }[];

        return physical_counts.length > 0 ? (
          <AppTable
            data={physical_counts ?? []}
            columns={[
              {
                header: "Quantity",
                accessorKey: "quantity",
                cell: (props) => props.getValue() as string,
              },
              {
                header: "Unit",
                accessorKey: "unit",
                cell: (props) => {
                  const unit = props.getValue<{
                    name: string;
                    code: string;
                  }>();
                  return (
                    <span>
                      {unit.name}({unit.code})
                    </span>
                  );
                },
              },
              {
                header: "Updated at",
                accessorKey: "count_date",
                cell: (props) => props.getValue() as string,
              },
            ]}
          />
        ) : null;
      },
      // cell: (props) => props.getValue() as string,
    },

    {
      header: "Total Price",
      accessorKey: "total_price",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Action",
      accessorKey: "total",
      cell: (props) => {
        const data = props.cell.row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: `Add count | ${data.product.name}`,
                buttonText: "Add",
                data,
              })
            }
          >
            <Plus className="mr-2" />
            Add count
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex flex-col mb-4 gap-2 overflow-auto">
        <div className="flex items-center gap-2">
          <div className="max-w-sm">
            <AppSearch />
          </div>
          <BaseFilter
            filters={[
              "branch_id",
              "product_id",
              "unit_id",
              "category_id",
              "sub_category_id",
            ]}
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <div className="max-w-md">
              <AppDateRangePicker
                placeholder="Physical Count Date Range"
                dateRange={dateRange}
                onChangeValue={(range) => {
                  setDateRange(range);
                  setParams({
                    ...getParams,

                    physical_count_date_from: range.from
                      ? format(range.from, "yyyy-MM-dd")
                      : undefined,
                    physical_count_date_to: range.to
                      ? format(range.to, "yyyy-MM-dd")
                      : undefined,
                  });
                }}
              />
            </div>
            {!!physical_count_date_from && !!physical_count_date_to && (
              <X
                onClick={() => {
                  setParams({}, [
                    "physical_count_date_to",
                    "physical_count_date_from",
                  ]);
                  setDateRange(undefined);
                }}
                className="size-4"
              />
            )}
          </div>
        </div>
      </div>
      <AppStatus status={status} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
      <InventoryCountForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        formData={formData}
      />
    </div>
  );
}
