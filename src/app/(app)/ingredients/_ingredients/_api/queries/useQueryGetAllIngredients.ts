import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllIngredientsProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllIngredients = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllIngredientsProps) => {
  const { getParams } = useManageUrl();
  const { page, search } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: ["get-ingredients-query", omitEmptyParams], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/products`, {
          params: { ...omitEmptyParams, type: "General" },
        })
      ).data?.data;
    },
  });

  return { ...query };
};
