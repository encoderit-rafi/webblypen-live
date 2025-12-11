import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type UpdateStockTransferStatusProps = {
  id: string | number;
  status: string | number;
};
export const useMutationUpdateStockTransferStatus = () => {
  return useMutation({
    mutationKey: ["update-transfers-status"],
    mutationFn: (body: UpdateStockTransferStatusProps) =>
      api.put(`/transfers/update/status/${body.id}`, { ...body }),
  });
};
