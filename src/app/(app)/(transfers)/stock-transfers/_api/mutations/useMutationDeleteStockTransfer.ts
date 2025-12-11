import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type DeletePStockTransferType = {
  id?: string | number;
};
export const useMutationDeleteStockTransfer = () => {
  return useMutation({
    mutationKey: ["delete-stock-transfer"],
    mutationFn: (body: DeletePStockTransferType) =>
      api.delete(`/transfers/${body.id}`),
  });
};
