import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

import { toFormData } from "@/utils/toFormData";
import { ExpenseCategoryType } from "../../_types/expense_category_types";
// import { ExpenseCategoryType } from "../../_types/expense_category_types";

export const useMutationCreateExpenseCategory = () => {
  return useMutation({
    mutationKey: ["create-expense-category"],
    mutationFn: (body: ExpenseCategoryType) => {
      const data =
        body.avatar instanceof File
          ? toFormData({ ...body, avatar: body.avatar }, { indices: true })
          : body;
      return api.post("/expense-categories", data);
    },
  });
};
