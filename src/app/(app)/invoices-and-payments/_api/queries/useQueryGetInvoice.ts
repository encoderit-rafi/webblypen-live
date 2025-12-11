import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type TProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetInvoice = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-invoice-data", id],
    enabled: enabled && !!id,
    staleTime: 0,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/invoices/${id}`)).data?.data;
    },
  });

  return { ...query };
};
