import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { omitEmpty } from "@/lib/utils";
import { InventoryDailyTrackSchemaType } from "../../_types/inventory_types";

export const useMutationUpdateKeyItem = () => {
  return useMutation({
    mutationKey: ["update-key-item"],
    mutationFn: (body: InventoryDailyTrackSchemaType) => {
      const payload = omitEmpty({
        id: body.id,
        branch_id: body.branch.id,
        ingredient_id: body.ingredient.id,
        ingredient_unit_id: body.ingredient_unit.id,
        total_out_quantity: body.total_out_quantity,
        ideal_recovery_rate: body.ideal_recovery_rate,
        recovery_rate: body.recovery_rate,
        variance: body.variance,
        adjusted_variance: body.adjusted_variance,
        details: (body?.details || []).map((item) => ({
          product_id: item.product.id,
          out_quantity_per_unit: item.out_quantity_per_unit,
          out_ingredient_unit_id: item.out_ingredient_unit.id,
          total_in_quantity: item.total_in_quantity,
          total_out_quantity: item.total_out_quantity,
        })),
        _method: "PUT",
      });

      return api.post(`/daily-key-items/${payload.id}`, payload);
    },
  });
};
