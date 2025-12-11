import api from "@/lib/axios";
import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllUnitsProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllUnits = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllUnitsProps) => {
  const { getParams } = useManageUrl();
  const { page, search } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
  });
  const query = useQuery({
    queryKey: ["get-units-query", page, search],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/units`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
