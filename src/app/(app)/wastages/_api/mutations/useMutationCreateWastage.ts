import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { WastageSchemaType } from "../../_types/wastage_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateWastage = () => {
  return useMutation({
    mutationKey: ["create-wastages"],
    mutationFn: (body: WastageSchemaType) => {
      const {
        branch: { id: branch_id },
        product: { id: product_id },
        unit: { id: unit_id },
        quantity,
        reason,
      } = body;
      const payload = omitEmpty({
        branch_id,
        product_id,
        unit_id,
        quantity,
        reason,
      });
      return api.post("/wastages", payload);
    },
  });
};
