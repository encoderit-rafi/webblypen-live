"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { AppPagination } from "@/components/base/AppPagination";
import ExpenseCategoryForm from "./_component/ExpenseCategoryForm";
import {
  ExpenseCategoryFormType,
  ExpenseCategorySchemaType,
} from "./_types/expense_category_types";
import { useQueryGetAllExpenseCategories } from "./_api/queries/useQueryGetAllExpenseCategories";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { ActionsType } from "@/types/global";
import { ICON_ATTRS, PERMISSIONS } from "@/data/global_data";
import { useMutationDeleteExpenseCategory } from "./_api/mutations/useMutationDeleteExpenseCategory";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import AppStatusToggle from "@/components/base/AppStatusToggle";
import { INITIAL_FORM_DATA } from "./_data/data";
import { useMutationUpdateExpenseCategoryStatus } from "./_api/mutations/useMutationUpdateExpenseCategoryStatus";
import { useManageUrl } from "@/hooks/use-manage-url";
import AppStatus from "@/components/base/AppStatus";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
import { useUserPermissions } from "@/hooks/use-user-permission";

export default function ExpenseCategories() {
  const permissions = useUserPermissions(PERMISSIONS.expense_category);

  const queryClient = useQueryClient();
  const [formData, setFormData] =
    useState<ExpenseCategoryFormType>(INITIAL_FORM_DATA);
  const [categoryID, setCategoryID] = useState<string | number | null>(null);
  const { data, status } = useQueryGetAllExpenseCategories({});
  const { getParams, setParams } = useManageUrl();
  const { page } = getParams;
  useEffect(() => {
    if (page > data?.meta?.last_page) {
      setParams({ page: data?.meta?.last_page || 1 });
    }
  }, [data, page]);
  const { mutate: deleteExpenseCategory, isPending: isPendingDeleteCategory } =
    useMutationDeleteExpenseCategory();

  const {
    mutate: updateCategoryStatus,
    isPending: isPendingUpdateCategoryStatus,
  } = useMutationUpdateExpenseCategoryStatus();
  function handleCategoryStatusToggle(category: {
    id: string | number | undefined;
    is_active: boolean;
  }) {
    updateCategoryStatus(
      {
        id: category.id,
        status: !category.is_active,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-expense-categories-query"],
          });
          toast.success(
            `Expense Category ${
              !category.is_active ? "activated" : "deactivated"
            } successfully!`
          );
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ||
                "Failed to update expense category status."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      }
    );
  }

  const columns: ColumnDef<ExpenseCategorySchemaType>[] = [
    {
      header: "Category",
      accessorKey: "name",
      cell: (props) => (
        <>
          {/* <Avatar className="size-6">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>IC</AvatarFallback>
          </Avatar> */}
          <span>{props.getValue() as string}</span>
        </>
      ),
    },
    // {
    //   header: "Active",
    //   accessorKey: "is_active",
    //   cell: (props) => {
    //     const data = props.cell.row.original;
    //     const category = {
    //       id: data.id,
    //       is_active: !!Number(props.getValue()),
    //     };
    //     return (
    //       <AppStatusToggle
    //         isLoading={
    //           categoryID == category.id && isPendingUpdateCategoryStatus
    //         }
    //         isActive={category.is_active}
    //         onToggle={() => {
    //           setCategoryID(category.id || null);
    //           handleCategoryStatusToggle(category);
    //         }}
    //         disabled={!permissions.update_status}
    //       />
    //     );
    //   },
    // },
    {
      header: "Actions",
      cell: (props) => {
        const data = props.cell.row.original;
        const Actions = [
          {
            type: "edit",
            label: "Edit",
            variant: "default",
            show: permissions.update_expense_category,
            icon: <SquarePen {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "update",
                title: `Update | ${data.name}`,
                buttonText: "update",
                data: {
                  ...data,
                  is_active: Boolean(data.is_active),
                },
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: permissions.delete_expense_category,
            icon: <Trash2 {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "delete",
                description: `Are you sure you want to delete ${data.name}? All your data will be removed permanently.`,
                buttonText: "delete",
                data,
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
        <div className="max-w-sm">
          <AppSearch />
        </div>
        {permissions.create_expense_category && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: "Create new expense category",
                buttonText: "create",
              })
            }
          >
            <Plus className="mr-2" />
            Add Expense Category
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

      <ExpenseCategoryForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        formData={formData}
      />

      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteCategory}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteExpenseCategory(formData.data, {
            onSuccess() {
              queryClient.invalidateQueries({
                queryKey: ["get-expense-categories-query"],
              });
              toast.success("Expense category deleted successfully!");
              setFormData(INITIAL_FORM_DATA);
            },
            onError(error) {
              if (isAxiosError(error)) {
                toast.error(
                  error.response?.data?.message ||
                    "Failed to delete expense category."
                );
              } else {
                toast.error("Something went wrong.");
              }
            },
          });
        }}
      />
    </div>
  );
}
