import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetAllPurchaseOrdersProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | null;
};
export const useQuerySendMailPurchaseOrder = ({
  enabled = true,
  refetchOnMount = false,
  id,
}: GetAllPurchaseOrdersProps) => {
  const query = useQuery({
    queryKey: ["send-mail-purchase-order-query", id],
    enabled: enabled && !!id,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/purchases/send-mail/${id}`)).data?.data;
    },
  });

  return { ...query };
};
