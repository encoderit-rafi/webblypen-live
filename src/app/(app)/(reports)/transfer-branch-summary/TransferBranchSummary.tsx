"use client";
import { AppPagination } from "@/components/base/AppPagination";
import AppSearch from "@/components/base/AppSearch";
import AppStatus from "@/components/base/AppStatus";
import AppTable from "@/components/base/AppTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
// import { da } from "date-fns/locale";
import BranchDropdown from "@/components/dropdowns/BranchDropdown";
import { useManageUrl } from "@/hooks/use-manage-url";
import { DateRange } from "react-day-picker";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { format } from "date-fns";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/utils/downloadFile";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
// import { useQueryGetAllTransferBranchSummary } from "./_api/queries/useQueryGetAllTransferBranchSummary";
// import { useQueryDownloadTransferBranchSummary } from "./_api/queries/useQueryDownloadTransferBranchSummary";
// import RecipeCategoriesDropdown from "@/components/dropdowns/RecipeCategory";
import CategoryDropdown from "@/components/dropdowns/CategoryDropdown";
// import { useQueryGetAllTransferBranchSummary } from "./_api/queries/useQueryGetAllTransferBranchSummary";
// import { useQueryDownloadTransferBranchSummary } from "./_api/queries/useQueryDownloadTransferBranchSummary";
import SupplierDropdown from "@/components/dropdowns/SupplierDropdown";
import ProductDropdown from "@/components/dropdowns/ProductDropdown";
import { useQueryGetAllTransferBranchSummary } from "./_api/queries/useQueryGetAllTransferBranchSummary";
import { useQueryDownloadTransferBranchSummary } from "./_api/queries/useQueryDownloadTransferBranchSummary";
// import { useQueryGetAllTransferBranchSummary } from "./_api/queries/useQueryGetAllTransferBranchSummary";
// import { useQueryDownloadTransferBranchSummary } from "./_api/queries/useQueryDownloadTransferBranchSummary";

export default function TransferBranchSummary() {
  const { setParams, getParams } = useManageUrl();
  const {
    received_date_from,
    received_date_to,
    transfer_date_from,
    transfer_date_to,
    branch_id,
  } = getParams;
  const [receivedDateRange, setReceivedDateRange] = useState<
    DateRange | undefined
  >(() => {
    if (received_date_from || received_date_to) {
      return {
        from: received_date_from ? new Date(received_date_from) : undefined,
        to: received_date_to ? new Date(received_date_to) : undefined,
      };
    }
  });
  const [transferDateRange, setTransferDateRange] = useState<
    DateRange | undefined
  >(() => {
    if (transfer_date_from || transfer_date_to) {
      return {
        from: transfer_date_from ? new Date(transfer_date_from) : undefined,
        to: transfer_date_to ? new Date(transfer_date_to) : undefined,
      };
    }
  });

  const { data: purchaseSummaryData, status } =
    useQueryGetAllTransferBranchSummary({
      // enabled,
    });
  console.log(
    "👉 ~ TransferBranchSummary ~ purchaseSummaryData:",
    purchaseSummaryData
  );
  const {
    data: downloadData,
    status: downloadStatus,
    isFetching,
    isSuccess,
    refetch: downloadTransferBranchSummary,
  } = useQueryDownloadTransferBranchSummary({
    // enabled,
  });
  useEffect(() => {
    if (
      !isFetching &&
      isSuccess &&
      downloadData &&
      downloadStatus === "success"
    ) {
      console.log("✅ ~ TransferBranchSummary ~ downloadData:", downloadData);
      const { file_name, download_link } = downloadData;
      downloadFile(file_name, download_link);
    }
  }, [isSuccess, isFetching, downloadData]);
  const { table_headers, data } = purchaseSummaryData ?? {};
  console.log("👉 ~ TransferBranchSummary ~ data:", data);
  type TransferBranchSummaryAPIType = (typeof data)[number];

  const columns: ColumnDef<TransferBranchSummaryAPIType>[] = (
    table_headers ?? []
  ).map((data: any) => ({
    header: data.header,
    accessorKey: data.accessor_key,
    cell: (props: any) => {
      const name = props.getValue() as string;
      console.log("✅ ~ TransferBranchSummary ~ name:", name);
      return name;
    },
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center  mb-4 gap-2">
          {/* <div className="flex items-center  mb-4 gap-2">
            <div className="max-w-sm">
              <AppSearch />
            </div>
          </div> */}
        </div>
        <Button
          variant={"outline"}
          onClick={() => {
            downloadTransferBranchSummary();
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
        <div className="max-w-fit border rounded-md">
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
        </div>

        <div className="max-w-md flex items-center gap-2">
          <AppDateRangePicker
            placeholder="Select a Received Date Range"
            dateRange={receivedDateRange}
            onChangeValue={(range) => {
              setReceivedDateRange(range);
              setParams({
                ...getParams,
                received_date_from: range.from
                  ? format(range.from, "yyyy-MM-dd")
                  : undefined,
                received_date_to: range.to
                  ? format(range.to, "yyyy-MM-dd")
                  : undefined,
              });
            }}
            className="h-8"
          />
        </div>
        {(received_date_from || received_date_to) && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => {
              setReceivedDateRange(undefined);
              setParams({}, ["received_date_from", "received_date_to"]);
            }}
          >
            <X />
          </Button>
        )}
        <div className="max-w-md flex items-center gap-2">
          <AppDateRangePicker
            placeholder="Select a Transfer Date Range"
            dateRange={transferDateRange}
            onChangeValue={(range) => {
              setTransferDateRange(range);
              setParams({
                ...getParams,
                transfer_date_from: range.from
                  ? format(range.from, "yyyy-MM-dd")
                  : undefined,
                transfer_date_to: range.to
                  ? format(range.to, "yyyy-MM-dd")
                  : undefined,
              });
            }}
            className="h-8"
          />
        </div>
        {(transfer_date_from || transfer_date_to) && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => {
              setTransferDateRange(undefined);
              setParams({}, ["transfer_date_from", "transfer_date_to"]);
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
