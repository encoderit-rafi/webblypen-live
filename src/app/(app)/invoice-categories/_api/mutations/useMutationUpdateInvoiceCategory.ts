import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { InvoiceCategoryType } from "../../_types/invoice_category_types";

export const useMutationUpdateInvoiceCategory = () => {
  return useMutation({
    mutationKey: ["update-invoice-category"],
    mutationFn: (body: InvoiceCategoryType) =>
      api.post(`/invoice-categories/${body.id}`, { ...body, _method: "PUT" }),
  });
};
