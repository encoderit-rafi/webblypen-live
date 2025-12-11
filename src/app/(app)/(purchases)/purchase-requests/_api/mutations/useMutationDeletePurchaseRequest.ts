import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type DeletePurchaseRequestType = {
  id?: string | number;
};
export const useMutationDeletePurchaseRequest = () => {
  return useMutation({
    mutationKey: ["delete-purchase-request"],
    mutationFn: (body: DeletePurchaseRequestType) =>
      api.delete(`/purchase-requests/${body.id}`),
  });
};
