import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

import { BrandDefaultUpdateType } from "../../_types/brand_types";

export const useMutationUpdateBrandDefault = () => {
  return useMutation({
    mutationKey: ["update-brand-default"],
    mutationFn: (body: BrandDefaultUpdateType) =>
      api.put(`/brands/update/default/${body.id}`, { ...body }),
  });
};
