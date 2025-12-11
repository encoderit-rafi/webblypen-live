"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, SquarePen, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import { AppPagination } from "@/components/base/AppPagination";
import ExpenseForm from "./_component/ExpenseForm";
import { ExpenseFormType } from "./_types/expense_types";
import { INITIAL_FORM_DATA } from "./_data/data";
import { ActionsType, GlobalFormType, OptionSchemaType } from "@/types/global";
import { useQueryGetAllExpenses } from "./_api/queries/useQueryGetAllExpenses";
import { useMutationDeleteExpense } from "./_api/mutations/useMutationDeleteExpense";
import AppStatus from "@/components/base/AppStatus";
import {
  EXPENSE_STATUS_DATA,
  GLOBAL_FORM_DATA,
  ICON_ATTRS,
  PERMISSIONS,
  TRANSFER_STATUS_DATA,
} from "@/data/global_data";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import AppStatusToggleDropdown from "@/components/base/AppStatusToggleDropdown";
import { isAxiosError } from "axios";
import { useMutationUpdateExpenseStatus } from "./_api/mutations/useMutationUpdateExpenseStatus";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { useManageUrl } from "@/hooks/use-manage-url";
import { useUserPermissions } from "@/hooks/use-user-permission";
import BranchDropdown from "@/components/dropdowns/BranchDropdown";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import ExpenseCategoriesDropdown from "@/components/dropdowns/ExpenseCategoriesDropdown";
import AppDateRangePicker from "@/components/base/AppDateRangePicker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { BaseFilter } from "@/components/base/BaseFilter";
import BaseDialog from "@/components/base/BaseDialog";
import StatusDropdown from "@/components/dropdowns/StatusDropdown";
export default function Expenses() {
  const { data: currentUser } = useQueryCurrentUser();
  const { branch_id: currentUserBranchID } = currentUser ?? {};
  const { getParams, setParams } = useManageUrl();
  const permissions = useUserPermissions(PERMISSIONS.expense);

  const {
    from_branch_id,
    to_branch_id,
    type,
    status,
    expense_date_from,
    expense_date_to,
  } = getParams;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (expense_date_from || expense_date_to) {
      return {
        from: expense_date_from ? new Date(expense_date_from) : undefined,
        to: expense_date_to ? new Date(expense_date_to) : undefined,
      };
    }
  });
  useEffect(() => {
    if (from_branch_id || to_branch_id || type) {
      setParams({
        from_branch_id,
        to_branch_id,
        type,
      });
    }
  }, [from_branch_id, to_branch_id, type]);

  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);
  const queryClient = useQueryClient();

  const [expenseID, setExpenseID] = useState<string | number | undefined>(
    undefined
  );
  const {
    mutate: updateExpenseStatus,
    isPending: isPendingUpdateExpenseStatus,
  } = useMutationUpdateExpenseStatus();

  const { mutate: deleteExpense, isPending: isPendingDeleteExpense } =
    useMutationDeleteExpense();
  const { data, status: statusE } = useQueryGetAllExpenses({});
  console.log("🚀 ~ Expenses ~ data:", data);
  type ExpenseAPIType = (typeof data)[number];

  const columns: ColumnDef<ExpenseAPIType>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (props) => {
        const name = props.getValue() as string;
        return name;
      },
    },
    {
      header: "Expense Number",
      accessorKey: "expense_number",
      cell: (props) => {
        const expense_number = props.getValue() as string;
        return expense_number;
      },
    },

    {
      header: "Category",
      accessorKey: "expense_category",
      cell: (props) => {
        const { name } = props.getValue() as { name: string };
        return name;
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (props) => {
        const amount = props.getValue() as string;
        return amount;
      },
    },
    {
      header: "Date",
      accessorKey: "expense_date",
      cell: (props) => {
        const expense_date = props.getValue() as string;
        return expense_date;
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
            loading={expenseID == data.id && isPendingUpdateExpenseStatus}
            options={EXPENSE_STATUS_DATA}
            onValueChange={(val) => {
              setExpenseID(data.id);
              updateExpenseStatus(
                {
                  id: data.id,
                  status: val,
                },
                {
                  onSuccess() {
                    queryClient.invalidateQueries({
                      queryKey: ["get-expenses-query"],
                    });
                    toast.success("Expense status updated successfully!");
                    setExpenseID(undefined);
                  },
                  onError(error) {
                    if (isAxiosError(error)) {
                      toast.error(
                        error.response?.data?.message ||
                          "Failed to update expense status."
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
        console.log("🚀 ~ data:", data);
        const Actions = [
          {
            type: "edit",
            label: "Edit",
            variant: "default",
            show: permissions.update_expense,
            // show: data.status_label != "Received",
            icon: <SquarePen {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "update",
                title: `Update`,
                description: "update expense",
                id: data.id,
                // buttonText: "update",
                // data: {
                //   ...data,
                //   Expense_role: {
                //     id: "",
                //     label: role,
                //     value: role,
                //   },
                // },
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_expense,
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
          <AppActionsDropdown
            actions={visibleActions}
            disabled={!visibleActions.length}
          />
        );
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
          <BaseFilter filters={["branch_id", "approved_by"]} />
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
              status="EXPENSE_STATUS_DATA"
            />
          </div>
        </div>

        {permissions.create_expense && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("CLICK ✅");
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: "Create",
                description: "create new expense",
                id: "",
              });
            }}
          >
            <Plus className="mr-2" />
            Expense
          </Button>
        )}
      </div>
      <div className="flex items-center mb-4 gap-2">
        <div className="flex items-center gap-1">
          <div className="max-w-sm">
            <AppDateRangePicker
              placeholder="Select expense date"
              dateRange={dateRange}
              onChangeValue={(range) => {
                setDateRange(range);
                setParams({
                  ...getParams,
                  expense_date_from: range.from
                    ? format(range.from, "yyyy-MM-dd")
                    : undefined,
                  expense_date_to: range.to
                    ? format(range.to, "yyyy-MM-dd")
                    : undefined,
                });
              }}
              className="h-8"
            />
          </div>
          {!!expense_date_from && !!expense_date_to && (
            <X
              onClick={() => {
                setParams({}, ["expense_date_to", "expense_date_from"]);
                setDateRange(undefined);
              }}
              className="size-4"
            />
          )}
        </div>
      </div>
      <AppStatus status={statusE} is_data={!!data?.length}>
        <AppTable data={data ?? []} columns={columns} />
      </AppStatus>

      {/* <ExpenseForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(INITIAL_FORM_DATA);
        }}
        formData={formData}
      /> */}
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
        <ExpenseForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteExpense}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteExpense(
            {
              id: formData.id,
            },
            {
              onSuccess(data) {
                console.log("✅ ~ onSuccess:::", data);
                queryClient.invalidateQueries({
                  queryKey: ["get-expenses-query"],
                });

                toast.success("Expense is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  toast.error(
                    error.response?.data?.message || "Failed to delete Expense."
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
