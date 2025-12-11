import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { InvoiceCategorySchemaType } from "../../_types/invoice_category_types";

export const useMutationDeleteInvoiceCategory = () => {
  return useMutation({
    mutationKey: ["delete-invoice-category"],
    mutationFn: (body: InvoiceCategorySchemaType) => api.delete(`/invoice-categories/${body.id}`),
  });
};
