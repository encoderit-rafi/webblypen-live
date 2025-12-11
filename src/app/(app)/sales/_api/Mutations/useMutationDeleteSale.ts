import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { SaleSchemaType } from "../../_types/sale_types";

export const useMutationDeleteSale = () => {
  return useMutation({
    mutationKey: ["delete-sale"],
    mutationFn: (body: SaleSchemaType) => api.delete(`/sales/import/${body.id}`),
  });
};
