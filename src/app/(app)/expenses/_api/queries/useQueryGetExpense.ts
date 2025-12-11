import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetPreExpenseProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetExpense = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: GetPreExpenseProps) => {
  const query = useQuery({
    queryKey: ["get-expense-data", id],
    enabled: enabled && !!id,
    staleTime: 0,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/expenses/${id}`)).data?.data;
    },
  });

  return { ...query };
};
