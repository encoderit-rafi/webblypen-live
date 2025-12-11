import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type UpdateExpenseStatusProps = {
  id: string | number;
  status: string | number;
};
export const useMutationUpdateExpenseStatus = () => {
  return useMutation({
    mutationKey: ["update-expenses-status"],
    mutationFn: (body: UpdateExpenseStatusProps) =>
      api.put(`/expenses/update/status/${body.id}`, { ...body }),
  });
};
