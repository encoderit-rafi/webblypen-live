import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { InventoryDailyTrackSchemaType } from "../../_types/inventory_types";

export const useMutationDeleteKeyItems = () => {
  return useMutation({
    mutationKey: ["delete-daily-key-items"],
    mutationFn: (body: Pick<InventoryDailyTrackSchemaType, "id">) =>
      api.delete(`/daily-key-items/${body.id}`),
  });
};
