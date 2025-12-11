import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetPreUserProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetUser = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: GetPreUserProps) => {
  const query = useQuery({
    queryKey: ["get-user-data", id],
    enabled: enabled && !!id,
    staleTime: 0,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/user/${id}`)).data?.data;
    },
  });

  return { ...query };
};
