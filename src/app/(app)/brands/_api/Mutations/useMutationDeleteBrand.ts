import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { BrandSchemaType } from "../../_types/brand_types";


export const useMutationDeleteBrand = () => {
  return useMutation({
    mutationKey: ["delete-brand"],
    mutationFn: (body: BrandSchemaType) => api.delete(`/brands/${body.id}`),
  });
};
