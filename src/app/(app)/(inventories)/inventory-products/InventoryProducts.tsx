"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import { AppPagination } from "@/components/base/AppPagination";
import { INITIAL_FORM_DATA } from "./_data/data";
import { InventoryFormType } from "./_types/inventory_types";
import { useQueryGetAllInventories } from "./_api/queries/useQueryGetAllInventories";
import InventoryProductForm from "./_component/InventoryProductForm";
import AppStatus from "@/components/base/AppStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import { Badge } from "@/components/ui/badge";

import ProductDropdown from "@/components/dropdowns/ProductDropdown";
import BrandDropdown from "@/components/dropdowns/BrandDropdown";
import BranchDropdown from "@/components/dropdowns/BranchDropdown";
import { useQueryCurrentUser } from "../../users/_api/queries/useQueryCurrentUser";
import { BaseFilter } from "@/components/base/BaseFilter";

export default function InventoryProducts() {
  const { getParams, setParams } = useManageUrl();
  const { page, product_id, category_id, sub_category_id, branch_id } =
    getParams;
  const [formData, setFormData] =
    useState<InventoryFormType>(INITIAL_FORM_DATA);

  const { data, status } = useQueryGetAllInventories({});
  type InventoriesAPIType = (typeof data.data)[number];

  const { data: currentUser } = useQueryCurrentUser();
  const { permissions: currentUserPermissions } = currentUser ?? {};
  const permissions = {
    adjust_stock: currentUserPermissions?.["adjust_stock_inventory"],
  };

  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);

  const columns: ColumnDef<InventoriesAPIType>[] = [
    {
      header: "Branch",
      accessorKey: "branch.name",
      cell: (props) => props.getValue() as string,
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
      header: "Product",
      accessorKey: "product.name",
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
      header: "Quantity",
      accessorKey: "quantity",
      cell: (props) => {
        const data = props.cell.row.original;
        console.log("👉 ~ InventoryProducts ~ data::::", data);
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
      header: "Unit",
      accessorKey: "unit",
      cell: (props) => {
        // const data = props.cell.row.original.product;
        const data = props.cell.row.original.unit;
        return `${data.name} (${data.code})`;
      },
    },
    {
      header: "Unit Price",
      accessorKey: "default_unit_price",
      cell: (props) => {
        // default_unit_price
        const data = props.cell.row.original.product;
        return data.default_unit_price;
      },
    },
    {
      header: "Avg Price",
      accessorKey: "avg_price",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Total Price",
      accessorKey: "ingredient_total_price",
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
        {permissions.adjust_stock && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: "Open Market/Petty Cash Stock",
                buttonText: "add",
                data: { ...INITIAL_FORM_DATA.data },
              })
            }
          >
            <Plus className="mr-2" />
            Open Market/Petty Cash Stock
          </Button>
        )}
      </div>
      {/* <div className="flex items-center mb-4 gap-2">
        <ProductDropdown
          selected_id={product_id}
          onValueChange={(val) => {
            if (!val.id) return;
            const isEqual = val.id == product_id;
            const productID = isEqual ? "" : val.id;
            if (isEqual) {
              setParams({}, ["product_id"]);
              return;
            }

            setParams({
              product_id: String(productID),
            });
          }}
        />
        <BranchDropdown
          selected_id={branch_id}
          onValueChange={(val) => {
            if (!val.id) return;
            const isEqual = val.id == branch_id;
            const branchID = isEqual ? "" : val.id;
            if (isEqual) {
              setParams({}, ["branch_id"]);
              return;
            }

            setParams({
              branch_id: String(branchID),
            });
          }}
        />
        <Button
          variant={"outline"}
          // size={"icon"}
          className="h-8 text-destructive hover:text-destructive"
          onClick={() => {
            setParams({ page: 1 }, ["product_id", "brand_id", "branch_id"]);
          }}
        >
          Clear All
          <X />
        </Button>
      </div> */}
      <AppStatus status={status} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
      <InventoryProductForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(INITIAL_FORM_DATA);
        }}
        formData={formData}
      />
    </div>
  );
}
