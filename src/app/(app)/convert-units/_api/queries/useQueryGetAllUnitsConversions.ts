import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
type GetAllUnitConversionsProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllUnitsConversions = ({ enabled = true,
  refetchOnMount = true }: GetAllUnitConversionsProps) => {
 
   const { getParams } = useManageUrl();
   const { page, search } = getParams;
 
   const omitEmptyParams = omitEmpty({
     ...getParams,
     per_page: SEARCH_PARAMS.per_page,
   });
  const query = useQuery({
    queryKey: ["get-Unit-Conversions-query", page, search],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/product-unit-conversions`, {
          params:omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
