import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type DeleteBatchItemType = {
  id?: string | number;
};
export const useMutationDeleteBatchItem = () => {
  return useMutation({
    mutationKey: ["delete-daily-batch-item"],
    mutationFn: (body: DeleteBatchItemType) =>
      api.delete(`/daily-batch-items/${body.id}`),
  });
};
