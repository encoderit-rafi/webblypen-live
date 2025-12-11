import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllPurchaseSummeryReceivedProductsProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllPurchaseSummeryReceivedProducts = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllPurchaseSummeryReceivedProductsProps) => {
  const { getParams } = useManageUrl();
  const { page, search } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: ["get-purchases-received-products-query", page, search], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/purchases/received-products`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
