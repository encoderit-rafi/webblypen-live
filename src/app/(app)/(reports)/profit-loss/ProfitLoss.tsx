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
// import { useQueryGetAllProfitLoss } from "./_api/queries/useQueryGetAllProfitLoss";
// import { useQueryDownloadProfitLoss } from "./_api/queries/useQueryDownloadProfitLoss";
import RecipeCategoriesDropdown from "@/components/dropdowns/RecipeCategory";
import { useQueryGetAllProfitLoss } from "./_api/queries/useQueryGetAllProfitLoss";
import { useQueryDownloadProfitLoss } from "./_api/queries/useQueryDownloadProfitLoss";

export default function ProfitLoss() {
  const { setParams, getParams } = useManageUrl();
  const { start_date, end_date } = getParams;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (start_date || end_date) {
      return {
        from: start_date ? new Date(start_date) : undefined,
        to: end_date ? new Date(end_date) : undefined,
      };
    }
  });
  const { data: recipeCostData, status } = useQueryGetAllProfitLoss({
    // enabled,
  });
  const {
    data: downloadData,
    status: downloadStatus,
    isFetching,
    isSuccess,
    refetch: downloadReportInventory,
  } = useQueryDownloadProfitLoss({
    // enabled,
  });
  useEffect(() => {
    if (
      !isFetching &&
      isSuccess &&
      downloadData &&
      downloadStatus === "success"
    ) {
      console.log("✅ ~ ProfitLoss ~ downloadData:", downloadData);
      const { file_name, download_link } = downloadData;
      downloadFile(file_name, download_link);
    }
  }, [isSuccess, isFetching, downloadData]);
  const { table_headers, data, meta } = recipeCostData ?? {};
  type ProfitLossAPIType = (typeof data)[number];

  const columns: ColumnDef<ProfitLossAPIType>[] = (table_headers ?? []).map(
    (data: any) => ({
      header: data.header,
      accessorKey: data.accessor_key,
      cell: (props: any) => {
        const name = props.getValue() as string;
        return name;
      },
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center  mb-4 gap-2">
          <div className="max-w-sm">{/* <AppSearch /> */}</div>

          <div className="max-w-md flex items-center gap-2">
            <AppDateRangePicker
              placeholder="Select a Date Range"
              dateRange={dateRange}
              onChangeValue={(range) => {
                setDateRange(range);
                setParams({
                  ...getParams,
                  start_date: range.from
                    ? format(range.from, "yyyy-MM-dd")
                    : undefined,
                  end_date: range.to
                    ? format(range.to, "yyyy-MM-dd")
                    : undefined,
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
      <AppStatus status={status} is_data={!!data?.length}>
        <AppTable data={data ?? []} columns={columns} />
        {/* <AppPagination page={meta?.current_page} lastPage={meta?.last_page} /> */}
      </AppStatus>
    </div>
  );
}
