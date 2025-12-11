import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ExpenseSchemaType } from "../../_types/expense_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateExpense = () => {
  return useMutation({
    mutationKey: ["create-stock-expense"],
    mutationFn: (body: ExpenseSchemaType) => {
      // const payload = omitEmpty({
      //   ...body,
      //   from_branch_id: body?.from_branch_id?.id || "",
      //   to_branch_id: body.to_branch_id.id,
      //   expense_items: body.expense_items.map((item) => ({
      //     ...item,
      //     product_id: item.product_id.id,
      //     brand_id: item.brand_id.id,
      //     unit_id: item.unit_id.id,
      //   })),
      // });
      const payload = omitEmpty({
        name: body.name,
        branch_id: body.branch.id,
        expense_category_id: body.expense_category.id,
        expense_date: body.expense_date,
        amount: body.amount,
        note: body.note,
        vat_type: body.vat_type ? "vat" : "nonvat",
        vat_amount: body.vat_type ? body.vat_amount : "",
      });

      return api.post("/expenses", payload);
    },
  });
};
