import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetPreOpenMarketsProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetOpenMarket = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: GetPreOpenMarketsProps) => {
  const query = useQuery({
    queryKey: ["get-open-market-data", id],
    enabled: enabled && !!id,
    staleTime: 0,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/open-market-purchases/${id}`)).data?.data;
    },
  });

  return { ...query };
};
