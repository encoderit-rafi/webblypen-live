import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetPrePurchaseOrdersProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetPrePurchaseOrder = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: GetPrePurchaseOrdersProps) => {
  const query = useQuery({
    queryKey: ["get-purchases-pre-order-data", id],
    enabled: enabled && !!id,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/purchases/po-order-create-data/${id}`)).data
        ?.data;
    },
  });

  return { ...query };
};
