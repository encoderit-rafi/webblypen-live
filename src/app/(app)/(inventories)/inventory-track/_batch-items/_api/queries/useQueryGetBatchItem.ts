import api from "@/lib/axios";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
type PropsType = GlobalPropsType & {
  id?: string | number;
};
export const useQueryGetBatchItem = ({
  enabled = true,
  refetchOnMount = true,
  id = "",
}: PropsType) => {
  const query = useQuery({
    queryKey: ["get-daily-batch-item-query", id],
    enabled: enabled && !!id,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/daily-batch-items/${id}`)).data?.data;
    },
  });

  return {
    ...query,
  };
};
