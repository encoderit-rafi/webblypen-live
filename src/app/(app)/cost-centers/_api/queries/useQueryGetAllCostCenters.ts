import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
type TProps = GlobalPropsType & {
  search?: string;
};
export const useQueryGetAllCostCenters = ({
  enabled = true,
  refetchOnMount = true,
}: TProps) => {
  const { getParams } = useManageUrl();
  const { page, search } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
  });
  const query = useQuery({
    queryKey: ["get-cost-centers-query", page, search],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/cost-centers`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
