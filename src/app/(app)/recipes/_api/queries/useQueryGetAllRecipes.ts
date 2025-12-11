import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllBranchesProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllRecipes = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllBranchesProps) => {
  const { getParams } = useManageUrl();
  const { page, search, product_id, category_id, sub_category_id } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams,

    per_page: SEARCH_PARAMS.per_page,
  });
  const query = useQuery({
    queryKey: [
      "get-recipes-query",
      page,
      search,
      product_id,
      category_id,
      sub_category_id,
    ],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/recipes`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
