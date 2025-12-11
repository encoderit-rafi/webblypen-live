import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllOnHandStockProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllOnHandStock = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllOnHandStockProps) => {
  const { getParams } = useManageUrl();
  const {
    page,
    search,
    product_id,
    branch_id,
    cost_center_id,
    start_date,
    end_date,
    category_id,
    sub_category_id,
  } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: [
      "get-reports-on-hand-stock-query",
      // page,
      // search,
      // start_date,
      // end_date,
      // product_id,
      // branch_id,
      // cost_center_id,
      // category_id,
      // sub_category_id,
      omitEmptyParams,
    ], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/on-hand-stock`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
