import api from "@/lib/axios";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
type PropsType = GlobalPropsType & {
  id?: string | number;
};
export const useQueryGetStockTransfer = ({
  enabled = true,
  refetchOnMount = true,
  id = "",
}: PropsType) => {
  const query = useQuery({
    queryKey: ["get-stock-transfer-query", id],
    enabled: enabled && !!id,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/transfers/${id}`)).data?.data;
    },
  });

  return {
    ...query,
  };
};
