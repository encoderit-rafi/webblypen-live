import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { WastageSchemaType } from "../../_types/wastage_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateWastage = () => {
  return useMutation({
    mutationKey: ["update-wastages"],
    mutationFn: (body: WastageSchemaType) => {
      const {
        id,
        branch: { id: branch_id },
        product: { id: product_id },
        unit: { id: unit_id },
        quantity,
        reason,
      } = body;

      const payload = omitEmpty({
        id,
        branch_id,
        product_id,
        unit_id,
        quantity,
        reason,
        _method: "PUT",
      });
      return api.post(`/wastages/${body.id}`, payload);
    },
  });
};
