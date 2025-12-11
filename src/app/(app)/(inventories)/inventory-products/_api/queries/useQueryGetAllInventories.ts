import { PRODUCT_TYPE, SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
type PropsType = GlobalPropsType;
export const useQueryGetAllInventories = ({
  enabled = true,
  refetchOnMount = true,
}: PropsType) => {
  const { getParams } = useManageUrl();
  // const { page, search } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
    type: PRODUCT_TYPE.general,
  });
  const query = useQuery({
    queryKey: ["get-inventories-query", omitEmptyParams],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/inventory`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
