import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type DeletePExpenseType = {
  id?: string | number;
};
export const useMutationDeleteExpense = () => {
  return useMutation({
    mutationKey: ["delete-expense"],
    mutationFn: (body: DeletePExpenseType) =>
      api.delete(`/expenses/${body.id}`),
  });
};
