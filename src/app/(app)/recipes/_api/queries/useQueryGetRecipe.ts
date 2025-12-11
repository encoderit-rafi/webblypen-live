import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
type GetPreRecipesProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
  id: string | number | undefined;
};
export const useQueryGetRecipe = ({
  enabled = true,
  refetchOnMount = true,
  id,
}: GetPreRecipesProps) => {
  const query = useQuery({
    queryKey: ["get-recipes-data", id],
    enabled: enabled && !!id,
    staleTime: 0,
    refetchOnMount,
    queryFn: async () => {
      return (await api.get(`/recipes/${id}`)).data?.data;
    },
  });

  return { ...query };
};
