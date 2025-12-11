import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { CostCenterSchemaType } from "../../_types/cost-center";

export const useMutationDeleteCostCenter = () => {
  return useMutation({
    mutationKey: ["delete-cost-center"],
    mutationFn: (body: Pick<CostCenterSchemaType, "id">) =>
      api.delete(`/cost-centers/${body.id}`),
  });
};
