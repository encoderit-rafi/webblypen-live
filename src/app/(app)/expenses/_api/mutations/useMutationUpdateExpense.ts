import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ExpenseSchemaType } from "../../_types/expense_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateExpense = () => {
  return useMutation({
    mutationKey: ["update-expense"],
    mutationFn: (body: ExpenseSchemaType) => {
      const payload = omitEmpty({
        id: body.id,
        name: body.name,
        branch_id: body.branch.id,
        expense_category_id: body.expense_category.id,
        expense_date: body.expense_date,
        amount: body.amount,
        note: body.note,
        vat_type: body.vat_type ? "vat" : "nonvat",
        vat_amount: body.vat_type ? body.vat_amount : "",
      });
      return api.put(`/expenses/${body.id}`, payload);
    },
  });
};
