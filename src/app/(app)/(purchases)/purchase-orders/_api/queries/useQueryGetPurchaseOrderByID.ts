import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetPrePurchaseOrdersProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetPurchaseOrderByID = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: GetPrePurchaseOrdersProps) => {
  const query = useQuery({
    queryKey: ["get-purchases-order-id", id],
    enabled: enabled && !!id,

    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/purchases/${id}`)).data?.data;
    },
  });

  return { ...query };
};
