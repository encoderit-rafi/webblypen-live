import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

import { toFormData } from "@/utils/toFormData";
import { InvoiceCategoryType } from "../../_types/invoice_category_types";



export const useMutationCreateInvoiceCategory = () => {
  return useMutation({
    mutationKey: ["create-invoice-category"],
    mutationFn: (body: InvoiceCategoryType) => {
      const data =
        body.avatar instanceof File
          ? toFormData({ ...body, avatar: body.avatar }, { indices: true })
          : body;
      return api.post("/invoice-categories", data);
    },
  });

};
