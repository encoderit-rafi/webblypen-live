import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllProfitLossProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllProfitLoss = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllProfitLossProps) => {
  const { getParams } = useManageUrl();
  const { page, search, start_date, end_date } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: [
      "get-reports-profit-loss-query",
      // page,
      // search,
      // start_date,
      // end_date,
      omitEmptyParams,
    ], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/profit-loss`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
