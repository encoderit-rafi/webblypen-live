import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ExpenseCategorySchemaType } from "../../_types/expense_category_types";
// import { ExpenseCategorySchemaType } from "../../_types/expense_category_types";

export const useMutationDeleteExpenseCategory = () => {
  return useMutation({
    mutationKey: ["delete-expense-category"],
    mutationFn: (body: ExpenseCategorySchemaType) =>
      api.delete(`/expense-categories/${body.id}`),
  });
};
