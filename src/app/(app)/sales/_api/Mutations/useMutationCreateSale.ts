import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { SaleType } from "../../_types/sale_types";
import { toFormData } from "@/utils/toFormData";

export const useMutationCreateSale = () => {
  return useMutation({
    mutationKey: ["import-sales"],
    mutationFn: (body: SaleType) => {
      const data =
        body.file instanceof File
          ? toFormData({ ...body, file: body.file })
          : body;

      return api.post("/sales/import", data);
    }
  });
};
