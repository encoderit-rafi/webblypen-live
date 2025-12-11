import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { BrandStatusUpdateType } from "../../_types/brand_types";

export const useMutationUpdateBrandStatus = () => {
  return useMutation({
    mutationKey: ["update-brand-status"],
    mutationFn: (body: BrandStatusUpdateType) =>
      api.put(`/brands/update/status/${body.id}`, { ...body }),
  });
};
