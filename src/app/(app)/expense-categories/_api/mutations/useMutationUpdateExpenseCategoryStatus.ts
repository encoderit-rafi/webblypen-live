import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ExpenseCategoryStatusUpdateType } from "../../_types/expense_category_types";
// import { ExpenseCategoryStatusUpdateType } from "../../_types/expense_category_types";

export const useMutationUpdateExpenseCategoryStatus = () => {
  return useMutation({
    mutationKey: ["update-expense-category-status"],
    mutationFn: (body: ExpenseCategoryStatusUpdateType) =>
      api.put(`/expense-categories/update/status/${body.id}`, { ...body }),
  });
};
