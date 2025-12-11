import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

type DeleteInvoiceType = {
  id: string | number;
};
export const useMutationDeleteInvoice = () => {
  return useMutation({
    mutationKey: ["delete-invoice"],
    mutationFn: (body: DeleteInvoiceType) => api.delete(`/invoices/${body.id}`),
  });
};
