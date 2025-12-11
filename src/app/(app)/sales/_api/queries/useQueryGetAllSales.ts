import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
type GetAllUnitSalesProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllSales = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllUnitSalesProps) => {
  const { getParams } = useManageUrl();
  const { 
    page,
    search,
    year,
    month,
    week,
    sale_date_from,
    sale_date_to,
    branch_id,
    recipe_id,
    recipe_category_id } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
  });
  const query = useQuery({
    queryKey: ["get-sales-query",
      page,
      search,
      year,
      month,
      week,
      sale_date_from,
      sale_date_to,
      branch_id,
      recipe_id,
      recipe_category_id,
    ],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/sales/details`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
