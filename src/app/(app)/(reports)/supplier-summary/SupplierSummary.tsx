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
// import { useQueryGetAllSupplierSummary } from "./_api/queries/useQueryGetAllSupplierSummary";
// import { useQueryDownloadSupplierSummary } from "./_api/queries/useQueryDownloadSupplierSummary";
// import RecipeCategoriesDropdown from "@/components/dropdowns/RecipeCategory";
import CategoryDropdown from "@/components/dropdowns/CategoryDropdown";
import { useQueryGetAllSupplierSummary } from "./_api/queries/useQueryGetAllSupplierSummary";
import { useQueryDownloadSupplierSummary } from "./_api/queries/useQueryDownloadSupplierSummary";
import SupplierDropdown from "@/components/dropdowns/SupplierDropdown";
import { BaseFilter } from "@/components/base/BaseFilter";

export default function SupplierSummary() {
  const { setParams, getParams } = useManageUrl();
  const {
    received_date_from,
    received_date_to,
    expected_delivery_date_from,
    expected_delivery_date_to,
    purchase_date_from,
    purchase_date_to,
    supplier_id,
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
  const [expectedDeliveryDateRange, setExpectedDeliveryDateRange] = useState<
    DateRange | undefined
  >(() => {
    if (expected_delivery_date_from || expected_delivery_date_to) {
      return {
        from: expected_delivery_date_from
          ? new Date(expected_delivery_date_from)
          : undefined,
        to: expected_delivery_date_to
          ? new Date(expected_delivery_date_to)
          : undefined,
      };
    }
  });
  const [purchaseDateRange, setPurchaseDateRange] = useState<
    DateRange | undefined
  >(() => {
    if (purchase_date_from || purchase_date_to) {
      return {
        from: purchase_date_from ? new Date(purchase_date_from) : undefined,
        to: purchase_date_to ? new Date(purchase_date_to) : undefined,
      };
    }
  });

  const { data: supplierSummaryData, status } = useQueryGetAllSupplierSummary({
    // enabled,
  });
  console.log(
    "👉 ~ SupplierSummary ~ supplierSummaryData:",
    supplierSummaryData
  );
  const {
    data: downloadData,
    status: downloadStatus,
    isFetching,
    isSuccess,
    refetch: downloadSupplierSummary,
  } = useQueryDownloadSupplierSummary({
    // enabled,
  });
  useEffect(() => {
    if (
      !isFetching &&
      isSuccess &&
      downloadData &&
      downloadStatus === "success"
    ) {
      console.log("✅ ~ SupplierSummary ~ downloadData:", downloadData);
      const { file_name, download_link } = downloadData;
      downloadFile(file_name, download_link);
    }
  }, [isSuccess, isFetching, downloadData]);
  const { table_headers, data, meta } = supplierSummaryData ?? {};
  console.log("👉 ~ SupplierSummary ~ data:", data);
  type SupplierSummaryAPIType = (typeof data.data)[number];

  const columns: ColumnDef<SupplierSummaryAPIType>[] = (
    table_headers ?? []
  ).map((data: any) => ({
    header: data.header,
    accessorKey: data.accessor_key,
    cell: (props: any) => {
      const name = props.getValue() as string;
      console.log("✅ ~ SupplierSummary ~ name:", name);
      return name;
    },
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center  mb-4 gap-2">
          <div className="flex items-center  mb-4 gap-2">
            <div className="flex items-center gap-2">
              <AppSearch />
              <BaseFilter filters={["supplier_id"]} />
            </div>
          </div>
        </div>
        <Button
          variant={"outline"}
          onClick={() => {
            downloadSupplierSummary();
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
        {/* {(received_date_from || received_date_to) && (
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
        )} */}
        {/* <div className="max-w-md flex items-center gap-2">
          <AppDateRangePicker
            placeholder="Select a Expected Delivery Date Range"
            dateRange={expectedDeliveryDateRange}
            onChangeValue={(range) => {
              setExpectedDeliveryDateRange(range);
              setParams({
                ...getParams,
                expected_delivery_date_from: range.from
                  ? format(range.from, "yyyy-MM-dd")
                  : undefined,
                expected_delivery_date_to: range.to
                  ? format(range.to, "yyyy-MM-dd")
                  : undefined,
              });
            }}
            className="h-8"
          />
        </div>
        {(expected_delivery_date_from || expected_delivery_date_to) && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => {
              setExpectedDeliveryDateRange(undefined);
              setParams({}, [
                "expected_delivery_date_from",
                "expected_delivery_date_to",
              ]);
            }}
          >
            <X />
          </Button>
        )} */}
        <div className="max-w-md flex items-center gap-2">
          <AppDateRangePicker
            placeholder="Select a Purchase Date Range"
            dateRange={purchaseDateRange}
            onChangeValue={(range) => {
              setPurchaseDateRange(range);
              setParams({
                ...getParams,
                purchase_date_from: range.from
                  ? format(range.from, "yyyy-MM-dd")
                  : undefined,
                purchase_date_to: range.to
                  ? format(range.to, "yyyy-MM-dd")
                  : undefined,
              });
            }}
            className="h-8"
          />
        </div>
        {(purchase_date_from || purchase_date_to) && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => {
              setPurchaseDateRange(undefined);
              setParams({}, ["purchase_date_from", "purchase_date_to"]);
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
