import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type UpdateStockTransferStatusProps = {
  id: string | number;
  status: string | number;
};
export const useMutationUpdateInvoicePaymentStatus = () => {
  return useMutation({
    mutationKey: ["update-invoices-status"],
    mutationFn: (body: UpdateStockTransferStatusProps) =>
      api.put(`/invoices/update/status/${body.id}`, { ...body }),
  });
};
