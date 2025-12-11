import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllOpenMarketProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllOpenMarket = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllOpenMarketProps) => {
  const { getParams } = useManageUrl();

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: ["get-open-markets-query", omitEmptyParams],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/open-market-purchases`, {
          params: omitEmptyParams,
        })
      ).data;
    },
  });

  return { ...query };
};
