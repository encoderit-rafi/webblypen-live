import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetPreWastagesProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetWastage = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: GetPreWastagesProps) => {
  const query = useQuery({
    queryKey: ["get-wastages-data", id],
    enabled: enabled && !!id,
    staleTime: 0,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/wastages/${id}`)).data?.data;
    },
  });

  return { ...query };
};
