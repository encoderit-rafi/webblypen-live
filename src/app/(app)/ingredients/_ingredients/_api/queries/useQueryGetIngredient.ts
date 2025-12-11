import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetPreIngredientsProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetIngredient = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: GetPreIngredientsProps) => {
  const query = useQuery({
    queryKey: ["get-ingredient-data", id],
    enabled: enabled && !!id,
    staleTime: 0,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/products/${id}`)).data?.data;
    },
  });

  return { ...query };
};
