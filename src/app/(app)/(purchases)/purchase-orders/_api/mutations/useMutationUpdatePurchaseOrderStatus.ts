import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type UpdatePurchaseOrderStatusProps = {
  id: string | number;
  status: string | number;
};
export const useMutationUpdatePurchaseOrderStatus = () => {
  return useMutation({
    mutationKey: ["update-purchase-order-status"],
    mutationFn: (body: UpdatePurchaseOrderStatusProps) =>
      api.put(`/purchases/update/status/${body.id}`, { ...body }),
  });
};
