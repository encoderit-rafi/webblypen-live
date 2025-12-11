import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { omitEmpty } from "@/lib/utils";
import { InventoryCountSchemaType } from "../../_types/inventory_count_types";

export const useMutationUpdateInventoryCount = () => {
  return useMutation({
    mutationKey: ["update-InventoryCount"],
    mutationFn: (body: InventoryCountSchemaType) => {
      const { inventory_count_id, physical_counts } = body;
      const payload = omitEmpty({
        inventory_count_id,
        physical_counts: physical_counts.map(
          ({ unit_id: { id }, quantity }) => ({
            unit_id: id,
            quantity,
          })
        ),
      });

      return api.post(`/inventory/physical-count`, payload);
    },
  });
};
