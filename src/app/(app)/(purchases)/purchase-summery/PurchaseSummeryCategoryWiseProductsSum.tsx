import { AppPagination } from "@/components/base/AppPagination";
import AppSearch from "@/components/base/AppSearch";
import AppStatus from "@/components/base/AppStatus";
import AppTable from "@/components/base/AppTable";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useManageUrl } from "@/hooks/use-manage-url";
import { useQueryGetAllPurchaseSummeryCategoryWiseProductsSum } from "./_api/queries/useQueryGetAllPurchaseSummeryCategoryWiseProductsSum";

export default function PurchaseSummeryCategoryWiseProductsSum() {
  const { getParam } = useManageUrl();
  const enabled = getParam("active_tab") == "category-wise-products-sum";
  const { data, status } = useQueryGetAllPurchaseSummeryCategoryWiseProductsSum(
    {
      enabled,
    }
  );
  console.log(
    "🚀 ~ PurchaseSummeryCategoryWiseProductsSum ~ data:",
    data?.data?.data
  );
  const initialData = data?.data?.data;
  type PurchaseRequestAPIType = (typeof initialData)[number];
  const columns: ColumnDef<PurchaseRequestAPIType>[] = [
    {
      header: "Category",
      accessorKey: "category_name",
      cell: (props) => {
        const name = props.getValue() as string;

        return name;
      },
    },
    {
      header: "Total",
      accessorKey: "total_amount",
      cell: (props) => {
        const name = props.getValue() as string;

        return (
          <div className="max-w-xs overflow-hidden whitespace-nowrap truncate">
            {name}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="max-w-sm">
          <AppSearch />
          {/* Grand Total : {data?.total} */}
        </div>
      </div>
      <AppStatus status={status} is_data={!!initialData?.length}>
        <AppTable
          data={
            initialData
              ? [
                  ...initialData,
                  {
                    category_name: "Grand Total",
                    total_amount: data?.total,
                  },
                ]
              : []
          }
          columns={columns}
        />
      </AppStatus>
    </div>
  );
}
