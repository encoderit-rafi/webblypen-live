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
// import { useQueryGetAllTransferItemsTrack } from "./_api/queries/useQueryGetAllTransferItemsTrack";
// import { useQueryDownloadTransferItemsTrack } from "./_api/queries/useQueryDownloadTransferItemsTrack";
// import RecipeCategoriesDropdown from "@/components/dropdowns/RecipeCategory";
import CategoryDropdown from "@/components/dropdowns/CategoryDropdown";
// import { useQueryGetAllTransferItemsTrack } from "./_api/queries/useQueryGetAllTransferItemsTrack";
// import { useQueryDownloadTransferItemsTrack } from "./_api/queries/useQueryDownloadTransferItemsTrack";
import SupplierDropdown from "@/components/dropdowns/SupplierDropdown";
import ProductDropdown from "@/components/dropdowns/ProductDropdown";
import { useQueryDownloadTransferItemsTrack } from "./_api/queries/useQueryDownloadTransferItemsTrack";
import { useQueryGetAllTransferItemsTrack } from "./_api/queries/useQueryGetAllTransferItemsTrack";
import UserDropdown from "@/components/dropdowns/UserDropdown";
import StatusDropdown from "@/components/dropdowns/StatusDropdown";
// import { useQueryGetAllTransferItemsTrack } from "./_api/queries/useQueryGetAllTransferItemsTrack";
// import { useQueryDownloadTransferItemsTrack } from "./_api/queries/useQueryDownloadTransferItemsTrack";

export default function TransferItemsTrack() {
  const { setParams, getParams } = useManageUrl();
  const {
    from_branch_id,
    to_branch_id,
    branch_id_for_in_out,
    status,
    transfer_date_from,
    transfer_date_to,
    received_date_from,
    received_date_to,
    requested_by,
    approved_by,
    received_by,
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

  const { data: purchaseSummaryData, status: statusTransferItem } =
    useQueryGetAllTransferItemsTrack({
      // enabled,
    });
  console.log(
    "👉 ~ TransferItemsTrack ~ purchaseSummaryData:",
    purchaseSummaryData
  );
  const {
    data: downloadData,
    status: downloadStatus,
    isFetching,
    isSuccess,
    refetch: downloadTransferItemsTrack,
  } = useQueryDownloadTransferItemsTrack({
    // enabled,
  });
  useEffect(() => {
    if (
      !isFetching &&
      isSuccess &&
      downloadData &&
      downloadStatus === "success"
    ) {
      console.log("✅ ~ TransferItemsTrack ~ downloadData:", downloadData);
      const { file_name, download_link } = downloadData;
      downloadFile(file_name, download_link);
    }
  }, [isSuccess, isFetching, downloadData]);
  const { table_headers, data, meta } = purchaseSummaryData ?? {};
  console.log("👉 ~ TransferItemsTrack ~ data:", data);
  type TransferItemsTrackAPIType = (typeof data.data)[number];

  const columns: ColumnDef<TransferItemsTrackAPIType>[] = (
    table_headers ?? []
  ).map((data: any) => ({
    header: data.header,
    accessorKey: data.accessor_key,
    cell: (props: any) => {
      const name = props.getValue() as string;
      console.log("✅ ~ TransferItemsTrack ~ name:", name);
      return name;
    },
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center  mb-4 gap-2">
          <div className="flex items-center  mb-4 gap-2">
            <div className="max-w-sm">
              <AppSearch />
            </div>
          </div>
        </div>
        <Button
          variant={"outline"}
          onClick={() => {
            downloadTransferItemsTrack();
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
        <div className="max-w-fit  border rounded-md">
          <BranchDropdown
            selected_id={from_branch_id}
            props={{ placeholder: "From Branch" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == from_branch_id;
              const branchID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["from_branch_id"]);
                return;
              }

              setParams({
                from_branch_id: String(branchID),
              });
            }}
          />
        </div>
        <div className="max-w-fit  border rounded-md">
          <BranchDropdown
            selected_id={to_branch_id}
            props={{ placeholder: "To Branch" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == to_branch_id;
              const branchID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["to_branch_id"]);
                return;
              }

              setParams({
                to_branch_id: String(branchID),
              });
            }}
          />
        </div>
        <div className="max-w-fit  border rounded-md">
          <BranchDropdown
            selected_id={branch_id_for_in_out}
            props={{ placeholder: "Branch for IN OUT" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == branch_id_for_in_out;
              const branchID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["branch_id_for_in_out"]);
                return;
              }

              setParams({
                branch_id_for_in_out: String(branchID),
              });
            }}
          />
        </div>
        {/* <div className="max-w-fit  border rounded-md">
          <UserDropdown
            selected_id={requested_by}
            props={{ placeholder: "Requested By" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == requested_by;
              const userID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["requested_by"]);
                return;
              }

              setParams({
                requested_by: String(userID),
              });
            }}
          />
        </div> */}
        {/* <div className="max-w-fit  border rounded-md">
          <UserDropdown
            selected_id={approved_by}
            props={{ placeholder: "Approved By" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == approved_by;
              const userID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["approved_by"]);
                return;
              }

              setParams({
                approved_by: String(userID),
              });
            }}
          />
        </div> */}
        <div className="max-w-fit  border rounded-md">
          <UserDropdown
            selected_id={received_by}
            props={{ placeholder: "Received By" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == received_by;
              const userID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["received_by"]);
                return;
              }

              setParams({
                received_by: String(userID),
              });
            }}
          />
        </div>
        <div className="max-w-fit  border rounded-md">
          <StatusDropdown
            selected_id={status}
            props={{ placeholder: "Status" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == status;
              const statusID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["status"]);
                return;
              }

              setParams({
                status: String(statusID),
              });
            }}
            status="TRANSFER_STATUS_DATA"
          />
        </div>

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
        <Button
          variant={"outline"}
          // size={"icon"}
          className="h-8 text-destructive hover:text-destructive"
          onClick={() => {
            setParams({ page: 1 }, [
              "from_branch_id",
              "to_branch_id",
              "branch_id_for_in_out",
              "status",
              "transfer_date_from",
              "transfer_date_to",
              "received_date_from",
              "received_date_to",
              "requested_by",
              "approved_by",
              "received_by",
            ]);
          }}
        >
          Clear All
          <X />
        </Button>
      </div>
      <AppStatus status={statusTransferItem} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
    </div>
  );
}
