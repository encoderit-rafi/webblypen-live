import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type UpdatePurchaseRequestStatusType = {
  id: string | number;
  status: string;
};
export const useMutationUpdatePurchaseRequestStatus = () => {
  return useMutation({
    mutationKey: ["update-purchase-request-status"],
    mutationFn: (body: UpdatePurchaseRequestStatusType) =>
      api.put(`/purchase-requests/update/status/${body.id}`, { ...body }),
  });
};
