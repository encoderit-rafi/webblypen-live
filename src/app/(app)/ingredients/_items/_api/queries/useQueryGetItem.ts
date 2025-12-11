import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetPreItemsProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetItem = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: GetPreItemsProps) => {
  const query = useQuery({
    queryKey: ["get-item-data", id],
    enabled: enabled && !!id,
    staleTime: 0,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/products/${id}`, {
          params: { type: "Intermediate" },
        })
      ).data?.data;
    },
  });

  return { ...query };
};
