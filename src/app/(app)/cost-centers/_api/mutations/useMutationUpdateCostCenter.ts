import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { CostCenterSchemaType } from "../../_types/cost-center";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateCostCenter = () => {
  return useMutation({
    mutationKey: ["update-cost-center"],
    mutationFn: (body: CostCenterSchemaType) => {
      const payload = omitEmpty({
        name: body.name,
        _method: "PUT",
      });
      return api.post(`/cost-centers/${body.id}`, payload);
    },
  });
};
