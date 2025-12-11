import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ExpenseCategoryType } from "../../_types/expense_category_types";
// import { ExpenseCategoryType } from "../../_types/expense_category_types";

export const useMutationUpdateExpenseCategory = () => {
  return useMutation({
    mutationKey: ["update-expense-category"],
    mutationFn: (body: ExpenseCategoryType) =>
      api.post(`/expense-categories/${body.id}`, { ...body, _method: "PUT" }),
  });
};
