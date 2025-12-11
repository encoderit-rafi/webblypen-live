"use client";
import { AppPagination } from "@/components/base/AppPagination";
import AppSearch from "@/components/base/AppSearch";
import AppStatus from "@/components/base/AppStatus";
import AppTable from "@/components/base/AppTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { da } from "date-fns/locale";
import BranchDropdown from "@/components/dropdowns/BranchDropdown";
import { useManageUrl } from "@/hooks/use-manage-url";
import { DateRange } from "react-day-picker";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { format } from "date-fns";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/utils/downloadFile";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
// import { useQueryGetAllOnHandStock } from "./_api/queries/useQueryGetAllOnHandStock";
// import { useQueryDownloadOnHandStock } from "./_api/queries/useQueryDownloadOnHandStock";
import RecipeCategoriesDropdown from "@/components/dropdowns/RecipeCategory";
import CategoryDropdown from "@/components/dropdowns/CategoryDropdown";
import CostCenterDropdown from "@/components/dropdowns/CostCenterDropdown";
import { useQueryDownloadOnHandStock } from "./_api/queries/useQueryDownloadOnHandStock";
import { useQueryGetAllOnHandStock } from "./_api/queries/useQueryGetAllOnHandStock";
import ProductDropdown from "@/components/dropdowns/ProductDropdown";
import { BaseFilter } from "@/components/base/BaseFilter";

export default function OnHandStock() {
  const { setParams, getParams } = useManageUrl();
  const {
    start_date,
    end_date,
    branch_id,
    cost_center_id,
    category_id,
    sub_category_id,
    product_id,
  } = getParams;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (start_date || end_date) {
      return {
        from: start_date ? new Date(start_date) : undefined,
        to: end_date ? new Date(end_date) : undefined,
      };
    }
  });
  const { data: materialUsageData, status } = useQueryGetAllOnHandStock({
    // enabled,
  });
  console.log("👉 ~ OnHandStock ~ materialUsageData:", materialUsageData);
  const {
    data: downloadData,
    status: downloadStatus,
    isFetching,
    isSuccess,
    refetch: downloadReportInventory,
  } = useQueryDownloadOnHandStock({
    // enabled,
  });
  useEffect(() => {
    if (
      !isFetching &&
      isSuccess &&
      downloadData &&
      downloadStatus === "success"
    ) {
      console.log("✅ ~ OnHandStock ~ downloadData:", downloadData);
      const { file_name, download_link } = downloadData;
      downloadFile(file_name, download_link);
    }
  }, [isSuccess, isFetching, downloadData]);
  const { table_headers, data, meta } = materialUsageData ?? {};
  console.log("👉 ~ OnHandStock ~ data:", data);
  type OnHandStockAPIType = (typeof data.data)[number];

  const columns: ColumnDef<OnHandStockAPIType>[] = (table_headers ?? []).map(
    (data: any) => ({
      header: data.header,
      accessorKey: data.accessor_key,
      cell: (props: any) => {
        const name = props.getValue() as string;
        console.log("✅ ~ OnHandStock ~ name:", name);
        return name;
      },
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center  mb-4 gap-2">
          <div className="flex items-center gap-2">
            <AppSearch />
            <BaseFilter
              filters={[
                "branch_id",
                "product_id",
                "category_id",
                // "sub_category_id",
                // "cost_center_id",
              ]}
            />
          </div>
        </div>
        <Button
          variant={"outline"}
          onClick={() => {
            downloadReportInventory();
          }}
        >
          {isFetching ? (
            <Spinner key="circle" variant="circle" />
          ) : (
            <Download />
          )}
          Download
        </Button>
      </div>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="max-w-md flex items-center gap-2">
          <AppDateRangePicker
            placeholder="Select a Sale Date Range"
            dateRange={dateRange}
            onChangeValue={(range) => {
              setDateRange(range);
              setParams({
                ...getParams,
                start_date: range.from
                  ? format(range.from, "yyyy-MM-dd")
                  : undefined,
                end_date: range.to ? format(range.to, "yyyy-MM-dd") : undefined,
              });
            }}
            className="h-8"
          />
        </div>
        {(start_date || end_date) && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => {
              setDateRange(undefined);
              setParams({}, ["start_date", "end_date"]);
            }}
          >
            <X />
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
    </div>
  );
}
