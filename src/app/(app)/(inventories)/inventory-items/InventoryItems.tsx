"use client";
import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import { AppPagination } from "@/components/base/AppPagination";
import { useQueryGetAllInventories } from "./_api/queries/useQueryGetAllInventories";
import AppStatus from "@/components/base/AppStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import { Badge } from "@/components/ui/badge";
import { BaseFilter } from "@/components/base/BaseFilter";

export default function InventoryItems() {
  const { getParams, setParams } = useManageUrl();
  const { page } = getParams;

  const { data, status } = useQueryGetAllInventories({});
  type InventoriesAPIType = (typeof data.data)[number];

  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);

  const columns: ColumnDef<InventoriesAPIType>[] = [
    {
      header: "Generic Name",
      accessorKey: "product_generic",
      cell: (props) => {
        const data = props.cell.row.original.product.product_generic;

        return data?.name;
      },
    },
    {
      header: "Product",
      accessorKey: "product.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Branch",
      accessorKey: "branch.name",
      cell: (props) => props.getValue() as string,
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
      header: "Unit",
      accessorKey: "unit",
      cell: (props) => {
        // const data = props.cell.row.original.product;
        const data = props.cell.row.original.unit;
        return `${data.name} (${data.code})`;
      },
    },

    {
      header: "Avg Price",
      accessorKey: "avg_price",
      cell: (props) => props.getValue() as string,
    },

    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: (props) => {
        const data = props.cell.row.original;
        const { product } = data;
        const quantity = props.getValue() as string;
        return (
          <Badge
            variant={
              +quantity <= +product.low_stock_threshold
                ? "destructive"
                : "secondary"
            }
          >
            {quantity}
          </Badge>
        );
      },
    },
    {
      header: "Cost Price",
      accessorKey: "item_cost_price",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Branch",
      accessorKey: "branch.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Last Adjust Date",
      accessorKey: "count_date",
      cell: (props) => {
        const count_date = props.getValue() as string;
        return count_date;
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="max-w-sm">
            <AppSearch />
          </div>
          <BaseFilter
            filters={[
              "branch_id",
              "product_id",
              "category_id",
              "sub_category_id",
            ]}
          />
        </div>
      </div>

      <AppStatus status={status} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
    </div>
  );
}
