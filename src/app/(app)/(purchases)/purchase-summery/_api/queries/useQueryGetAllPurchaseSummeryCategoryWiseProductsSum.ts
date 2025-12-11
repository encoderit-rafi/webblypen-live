import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllPurchaseSummeryCategoryWiseProductsSumProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllPurchaseSummeryCategoryWiseProductsSum = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllPurchaseSummeryCategoryWiseProductsSumProps) => {
  const { getParams } = useManageUrl();
  const { page, search } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: [
      "get-purchases-category-wise-po-product-sum-query",
      page,
      search,
    ], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/purchases/category-wise-po-product-sum`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
