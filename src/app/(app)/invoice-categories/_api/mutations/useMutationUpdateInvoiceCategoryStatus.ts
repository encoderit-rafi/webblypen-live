import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { InvoiceCategoryStatusUpdateType } from "../../_types/invoice_category_types";

export const useMutationUpdateInvoiceCategoryStatus = () => {
  return useMutation({
    mutationKey: ["update-invoice-category-status"],
    mutationFn: (body: InvoiceCategoryStatusUpdateType) =>
      api.put(`/invoice-categories/update/status/${body.id}`, { ...body }),
  });
};
