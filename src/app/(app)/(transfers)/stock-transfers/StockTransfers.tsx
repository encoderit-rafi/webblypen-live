"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, Eye, Plus, SquarePen, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import { AppPagination } from "@/components/base/AppPagination";
import StockTransferForm from "./_component/StockTransferForm";
import { ActionsType, GlobalFormType } from "@/types/global";
import { useQueryGetAllStockTransfers } from "./_api/queries/useQueryGetAllStockTransfers";
import { useMutationDeleteStockTransfer } from "./_api/mutations/useMutationDeleteStockTransfer";
import AppStatus from "@/components/base/AppStatus";
import {
  GLOBAL_FORM_DATA,
  ICON_ATTRS,
  PERMISSIONS,
  TRANSFER_STATUS_DATA,
} from "@/data/global_data";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import AppStatusToggleDropdown from "@/components/base/AppStatusToggleDropdown";
import { isAxiosError } from "axios";
import { useMutationUpdateStockTransferStatus } from "./_api/mutations/useMutationUpdateStockTransferStatus";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { useManageUrl } from "@/hooks/use-manage-url";
import { format } from "date-fns";
import StockTransferCard from "@/components/base/cards/StockTransferCard";
import { useQueryCurrentUser } from "../../users/_api/queries/useQueryCurrentUser";
import AppDownloadButton from "@/components/base/AppDownloadButton";
import { useUserPermissions } from "@/hooks/use-user-permission";
import BaseDialog from "@/components/base/BaseDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import StatusDropdown from "@/components/dropdowns/StatusDropdown";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { DateRange } from "react-day-picker";
type TFilterOptions = {
  id: string;
  value: "stock_in" | "stock_out";
  label: string;
};
const filterOptions: TFilterOptions[] = [
  {
    id: "stock_in",
    value: "stock_in",
    label: "Stock IN",
  },
  {
    id: "stock_out",
    value: "stock_out",
    label: "Stock OUT",
  },
];

export default function StockTransfers() {
  const { getParams, setParams } = useManageUrl();
  const {
    from_branch_id,
    to_branch_id,
    type,
    status,
    transfer_date_from,
    transfer_date_to,
    received_date_from,
    received_date_to,
  } = getParams;
  const [transferDateRange, setTransferDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [receivedDateRange, setReceivedDueDateRange] = useState<
    DateRange | undefined
  >(undefined);
  useEffect(() => {
    if (from_branch_id || to_branch_id || type) {
      setParams({
        from_branch_id,
        to_branch_id,
        type,
      });
    }
  }, [from_branch_id, to_branch_id, type]);
  const { data: currentUser } = useQueryCurrentUser();
  const {
    permissions: currentUserPermissions,
    branch_id: currentUserBranchID,
    branch: currentUserBranch,
  } = currentUser ?? {};
  const permissions = useUserPermissions(PERMISSIONS.transfer);

  const [selectedFilter, setSelectedFilter] = useState<TFilterOptions>(
    filterOptions[0]
  );
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);

  useEffect(() => {
    if (!currentUserBranchID) return;

    const params =
      selectedFilter.id == "stock_in"
        ? { type: "stock_in", to_branch_id: currentUserBranchID }
        : { type: "stock_out", from_branch_id: currentUserBranchID };
    setParams(params);
  }, [currentUserBranch]);

  useEffect(() => {
    const params =
      selectedFilter.id == "stock_in"
        ? { to_branch_id: currentUserBranchID || "all" }
        : { from_branch_id: currentUserBranchID || "all" };
    setParams({ ...params, page: 1, type: selectedFilter.value }, [
      selectedFilter.id == "stock_in" ? "from_branch_id" : "to_branch_id",
    ]);
  }, [selectedFilter]);

  const queryClient = useQueryClient();

  const [stockID, setStockID] = useState<string | number | undefined>(
    undefined
  );
  const {
    mutate: updateStockTransferStatus,
    isPending: isPendingUpdateStockTransferStatus,
  } = useMutationUpdateStockTransferStatus();

  const {
    mutate: deleteStockTransfer,
    isPending: isPendingDeleteStockTransfer,
  } = useMutationDeleteStockTransfer();
  const { data, status: statusST } = useQueryGetAllStockTransfers({});
  type PStockTransferAPIType = (typeof data.data)[number];
  useEffect(() => {
    console.log("🚀 ~ StockTransfers ~ data:", data?.data);
  }, [data]);

  const columns: ColumnDef<PStockTransferAPIType>[] = [
    {
      header: "Transfer Number",
      accessorKey: "transfer_number",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Send Branch",
      accessorKey: "from_branch",
      cell: (props) => {
        const { name } = props.getValue<{ name: string }>();
        return name;
      },
    },
    {
      header: "Receive Branch",
      accessorKey: "to_branch",
      cell: (props) => {
        const { name } = props.getValue<{ name: string }>();
        return name;
      },
    },

    {
      header: "Request Number",
      accessorKey: "product_count",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Request By",
      accessorKey: "requested_by_user.name",
      cell: (props) => props.getValue() as string,
    },
    // {
    {
      header: "Date Needed",
      accessorKey: "expected_delivery_date",
      cell: (props) => {
        const name = props.getValue<string | null>();
        // return format(new Date(name || ""), "PPP") || "-";
        return name || "-";
      },
    },
    {
      header: "Status",
      accessorKey: "status_label",
      cell: (props) => {
        const data = props.cell.row.original;
        const name = props.getValue() as string;

        return (
          <AppStatusToggleDropdown
            selectedValue={name}
            loading={stockID == data.id && isPendingUpdateStockTransferStatus}
            options={TRANSFER_STATUS_DATA.filter((status) => {
              return (
                currentUserPermissions?.[status.permissions] &&
                status.request_type.includes(String(selectedFilter.id))
              );
            })}
            onValueChange={(val) => {
              setStockID(data.id);
              updateStockTransferStatus(
                {
                  id: data.id,
                  status: val,
                },
                {
                  onSuccess() {
                    queryClient.invalidateQueries({
                      queryKey: ["get-stock-transfers-query"],
                    });
                    toast.success(
                      "Stock transfer status updated successfully!"
                    );
                    setStockID(undefined);
                  },
                  onError(error) {
                    if (isAxiosError(error)) {
                      toast.error(
                        error.response?.data?.message ||
                          "Failed to update stock transfer status."
                      );
                    } else {
                      toast.error("Something went wrong.");
                    }
                  },
                }
              );
            }}
          />
        );
      },
    },
    {
      header: "Actions",
      cell: (props) => {
        const data = props.cell.row.original;
        console.log("🚀 ~ data:::", data);
        const Actions = [
          {
            type: "view",
            label: "view",
            variant: "default",
            show: permissions.view_transfer,
            // show: data.status_label != "Received",
            icon: <Eye {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "view",
                title: `View`,
                description: `view  Stock Transfer`,
                id: data.id,
              });
            },
          },
          {
            type: "edit",
            label: "Edit",
            variant: "default",
            show: permissions.update_transfer && data.status != 5,
            icon: <SquarePen {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "update",
                title: "Update",
                description: `Update  Stock Transfer`,
                id: data.id,
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_transfer,
            icon: <Trash2 {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "delete",
                title: "Are you sure?",
                description: `Are you sure you want to delete? All your data will be removed permanently.`,
                id: data.id,
              });
            },
          },
        ] as const satisfies readonly ActionsType[];
        const visibleActions = Actions.filter((item) => item.show);
        return (
          <div>
            <AppActionsDropdown
              actions={visibleActions}
              disabled={!visibleActions.length}
            />
            <AppDownloadButton url={`/transfers/generate/pdf/${data.id}`} />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="max-w-sm flex items-center gap-2">
          <AppSearch />
          {currentUserBranchID && (
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                // disabled={loading || disabled || !options?.length}
                // className="p-0 w-full"
              >
                {/* {!!label && <Label>{label}</Label>} */}
                <Button
                  variant="outline"
                  className="h-8 flex items-center justify-between gap-1.5"
                >
                  {selectedFilter.label}
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="space-y-1">
                {filterOptions?.map((options: TFilterOptions) => {
                  const isChecked = selectedFilter.value == options.value;

                  return (
                    <DropdownMenuCheckboxItem
                      key={options.id}
                      checked={isChecked}
                      onCheckedChange={() => setSelectedFilter(options)}
                      className={cn(
                        "group px-2 py-1 cursor-pointer rounded-md",
                        {
                          "bg-muted": isChecked,
                        }
                      )}
                    >
                      {options.label}
                      {/* <X className="opacity-0 group-hover:opacity-100"  /> */}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="border rounded-md">
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
        </div>
        {permissions.create_transfer && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                type: "create",
                title: "Create",
                description: "create new stock transfer",
              });
            }}
          >
            <Plus className="mr-2" />
            Stock Transfer
          </Button>
        )}
      </div>
      <div className="flex items-center mb-4 gap-2">
        <div className="flex items-center gap-1">
          <div className="max-w-sm">
            <AppDateRangePicker
              placeholder="Select transfer date"
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
          {!!transfer_date_from && !!transfer_date_to && (
            <X
              onClick={() => {
                setParams({}, ["transfer_date_to", "transfer_date_from"]);
                setTransferDateRange(undefined);
              }}
              className="size-4"
            />
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="max-w-sm">
            <AppDateRangePicker
              placeholder="Select received date"
              dateRange={receivedDateRange}
              onChangeValue={(range) => {
                setReceivedDueDateRange(range);
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
          {!!received_date_from && !!received_date_to && (
            <X
              onClick={() => {
                setParams({}, ["received_date_from", "received_date_to"]);
                setReceivedDueDateRange(undefined);
              }}
              className="size-4"
            />
          )}
        </div>
      </div>
      <AppStatus status={statusST} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
      <StockTransferCard
        title={formData.title || ""}
        open={formData.type === "view"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
        id={formData.id || ""}
      />

      <BaseDialog
        title={formData?.title || ""}
        description={formData?.description || ""}
        component_props={{
          content: {
            className: "max-w-full sm:max-w-7xl",
          },
        }}
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
      >
        <StockTransferForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
          active_tab={selectedFilter.value}
        />
      </BaseDialog>
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteStockTransfer}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteStockTransfer(
            {
              id: formData.id,
            },
            {
              onSuccess(data) {
                console.log("✅ ~ onSuccess:::", data);
                queryClient.invalidateQueries({
                  queryKey: ["get-stock-transfers-query"],
                });

                toast.success("Stock transfer is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete Stock transfer."
                  );
                } else {
                  toast.error("Something went wrong.");
                }
              },
            }
          );
        }}
      />
    </div>
  );
}
