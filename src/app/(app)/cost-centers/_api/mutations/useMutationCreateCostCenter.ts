import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { CostCenterSchemaType } from "../../_types/cost-center";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateCostCenter = () => {
  return useMutation({
    mutationKey: ["create-cost-center"],
    mutationFn: (body: CostCenterSchemaType) => {
      const payload = omitEmpty({
        name: body.name,
      });
      return api.post("/cost-centers", payload);
    },
  });
};
