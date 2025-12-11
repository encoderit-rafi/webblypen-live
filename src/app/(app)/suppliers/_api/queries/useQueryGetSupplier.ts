import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetPreSupplierProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetSupplier = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: GetPreSupplierProps) => {
  const query = useQuery({
    queryKey: ["get-suppliers-data", id],
    enabled: enabled && !!id,
    staleTime: 0,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/suppliers/${id}`)).data?.data;
    },
  });

  return { ...query };
};
