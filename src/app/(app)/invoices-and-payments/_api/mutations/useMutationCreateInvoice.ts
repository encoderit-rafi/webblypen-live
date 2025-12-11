import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { InvoiceSchemaType } from "../../_types/invoices_types";
import { omitEmpty } from "@/lib/utils";
import { toFormData } from "@/utils/toFormData";

export const useMutationCreateInvoice = () => {
  return useMutation({
    mutationKey: ["create-invoice"],
    mutationFn: (body: InvoiceSchemaType) => {
      const data = omitEmpty({
        ...body,
        invoice_category_id: Number(body.invoice_category.id),
        branch_id: body?.branch?.id,
        supplier_id: body?.supplier?.id,
        // status: Number(body.status.id),
      });
      const payload =
        data.inv_doc_from_supplier instanceof File ||
        data.bank_doc instanceof File
          ? toFormData({
              ...data,
              inv_doc_from_supplier: data.inv_doc_from_supplier,
              bank_doc: data.bank_doc,
            })
          : data;
      return api.post("/invoices", payload);
    },
  });
};
