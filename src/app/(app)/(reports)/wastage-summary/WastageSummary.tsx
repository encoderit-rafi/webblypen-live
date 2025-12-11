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
// import { useQueryGetAllWastageSummary } from "./_api/queries/useQueryGetAllWastageSummary";
// import { useQueryDownloadWastageSummary } from "./_api/queries/useQueryDownloadWastageSummary";
import RecipeCategoriesDropdown from "@/components/dropdowns/RecipeCategory";
import CategoryDropdown from "@/components/dropdowns/CategoryDropdown";
import CostCenterDropdown from "@/components/dropdowns/CostCenterDropdown";
// import { useQueryDownloadWastageSummary } from "./_api/queries/useQueryDownloadWastageSummary";
// import { useQueryGetAllWastageSummary } from "./_api/queries/useQueryGetAllWastageSummary";
import ProductDropdown from "@/components/dropdowns/ProductDropdown";
import { useQueryGetAllWastageSummary } from "./_api/queries/useQueryGetAllWastageSummary";
import { useQueryDownloadWastageSummary } from "./_api/queries/useQueryDownloadWastageSummary";
import UnitDropdown from "@/components/dropdowns/UnitDropdown";
import { BaseFilter } from "@/components/base/BaseFilter";

export default function WastageSummary() {
  const { setParams, getParams } = useManageUrl();
  const { product_id, unit_id, branch_id, wastage_date_from, wastage_date_to } =
    getParams;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (wastage_date_from || wastage_date_to) {
      return {
        from: wastage_date_from ? new Date(wastage_date_from) : undefined,
        to: wastage_date_to ? new Date(wastage_date_to) : undefined,
      };
    }
  });
  const { data: materialUsageData, status } = useQueryGetAllWastageSummary({
    // enabled,
  });
  console.log("👉 ~ WastageSummary ~ materialUsageData:", materialUsageData);
  const {
    data: downloadData,
    status: downloadStatus,
    isFetching,
    isSuccess,
    refetch: downloadReportInventory,
  } = useQueryDownloadWastageSummary({
    // enabled,
  });
  useEffect(() => {
    if (
      !isFetching &&
      isSuccess &&
      downloadData &&
      downloadStatus === "success"
    ) {
      console.log("✅ ~ WastageSummary ~ downloadData:", downloadData);
      const { file_name, download_link } = downloadData;
      downloadFile(file_name, download_link);
    }
  }, [isSuccess, isFetching, downloadData]);
  const { table_headers, data } = materialUsageData ?? {};
  console.log("👉 ~ WastageSummary ~ data:", data);
  type WastageSummaryAPIType = (typeof data)[number];

  const columns: ColumnDef<WastageSummaryAPIType>[] = (table_headers ?? []).map(
    (data: any) => ({
      header: data.header,
      accessorKey: data.accessor_key,
      cell: (props: any) => {
        const name = props.getValue() as string;
        console.log("✅ ~ WastageSummary ~ name:", name);
        return name;
      },
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center  mb-4 gap-2">
          <div className="flex items-center  mb-4 gap-2">
            <div className="flex items-center gap-2">
              <AppSearch />
              <BaseFilter
                filters={[
                  "branch_id",
                  // "product_id",
                  // "unit_id",
                  // "category_id",
                  // "sub_category_id",
                ]}
              />
            </div>
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
            placeholder="Select a 
             Date Range"
            dateRange={dateRange}
            onChangeValue={(range) => {
              setDateRange(range);
              setParams({
                ...getParams,
                wastage_date_from: range.from
                  ? format(range.from, "yyyy-MM-dd")
                  : undefined,
                wastage_date_to: range.to
                  ? format(range.to, "yyyy-MM-dd")
                  : undefined,
              });
            }}
            className="h-8"
          />
        </div>
        {(wastage_date_from || wastage_date_to) && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => {
              setDateRange(undefined);
              setParams({}, ["wastage_date_from", "wastage_date_to"]);
            }}
          >
            <X />
          </Button>
        )}
      </div>
      <AppStatus status={status} is_data={!!data?.length}>
        <AppTable data={data ?? []} columns={columns} />
        {/* <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        /> */}
      </AppStatus>
    </div>
  );
}
