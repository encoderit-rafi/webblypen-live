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
import { useQueryGetAllRecipeCost } from "./_api/queries/useQueryGetAllRecipeCost";
import { useQueryDownloadRecipeCost } from "./_api/queries/useQueryDownloadRecipeCost";
import RecipeCategoriesDropdown from "@/components/dropdowns/RecipeCategory";
import { BaseFilter } from "@/components/base/BaseFilter";

export default function RecipeCost() {
  const { setParams, getParams } = useManageUrl();
  const { created_at_from, created_at_to, recipe_category_id } = getParams;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (created_at_from || created_at_to) {
      return {
        from: created_at_from ? new Date(created_at_from) : undefined,
        to: created_at_to ? new Date(created_at_to) : undefined,
      };
    }
  });
  const { data: recipeCostData, status } = useQueryGetAllRecipeCost({
    // enabled,
  });
  const {
    data: downloadData,
    status: downloadStatus,
    isFetching,
    isSuccess,
    refetch: downloadReportInventory,
  } = useQueryDownloadRecipeCost({
    // enabled,
  });
  useEffect(() => {
    if (
      !isFetching &&
      isSuccess &&
      downloadData &&
      downloadStatus === "success"
    ) {
      console.log("✅ ~ RecipeCost ~ downloadData:", downloadData);
      const { file_name, download_link } = downloadData;
      downloadFile(file_name, download_link);
    }
  }, [isSuccess, isFetching, downloadData]);
  const { table_headers, data, meta } = recipeCostData ?? {};
  type RecipeCostAPIType = (typeof data)[number];

  const columns: ColumnDef<RecipeCostAPIType>[] = (table_headers ?? []).map(
    (data: any) => ({
      header: data.header,
      accessorKey: data.accessor_key,
      cell: (props: any) => {
        const name = props.getValue() as string;
        console.log("✅ ~ RecipeCost ~ name:", name);
        return name;
      },
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center  mb-4 gap-2">
          <div className="max-w-sm">
            <AppSearch />
          </div>
          <BaseFilter filters={["recipe_category_id"]} />
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
      {/* <div className="flex items-center gap-2">
        <div className="max-w-md flex items-center gap-2">
          <AppDateRangePicker
            placeholder="Select a Sale Date Range"
            dateRange={dateRange}
            onChangeValue={(range) => {
              setDateRange(range);
              setParams({
                ...getParams,
                created_at_from: range.from
                  ? format(range.from, "yyyy-MM-dd")
                  : undefined,
                created_at_to: range.to
                  ? format(range.to, "yyyy-MM-dd")
                  : undefined,
              });
            }}
            className="h-8"
          />
        </div>
        {(created_at_from || created_at_to) && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => {
              setDateRange(undefined);
              setParams({}, ["created_at_from", "created_at_to"]);
            }}
          >
            <X />
          </Button>
        )}
      </div> */}
      <AppStatus status={status} is_data={!!data?.length}>
        <AppTable data={data ?? []} columns={columns} />
        <AppPagination page={meta?.current_page} lastPage={meta?.last_page} />
      </AppStatus>
    </div>
  );
}
