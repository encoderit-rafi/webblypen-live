import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type DeletePurchaseOrderType = {
  id?: string | number;
};
export const useMutationDeletePurchaseOrder = () => {
  return useMutation({
    mutationKey: ["delete-purchase-order"],
    mutationFn: (body: DeletePurchaseOrderType) =>
      api.delete(`/purchases/${body.id}`),
  });
};
