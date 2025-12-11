import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { SaleType } from "../../_types/sale_types";

export const useMutationUpdateSale = () => {
  return useMutation({
    mutationKey: ["update-sale"],
    mutationFn: (body: SaleType) =>
      api.post(`/sales/import/${body.id}`, { ...body, _method: "PUT" }),
  });
};
