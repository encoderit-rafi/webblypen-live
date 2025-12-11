import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllWastageSummaryProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllWastageSummary = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllWastageSummaryProps) => {
  const { getParams } = useManageUrl();
  const {
    page,
    search,
    product_id,
    branch_id,
    cost_center_id,
    wastage_date_from,
    wastage_date_to,
    category_id,
    sub_category_id,
    unit_id,
  } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: [
      "get-reports-wastage-summary-query",
      // page,
      // search,
      // wastage_date_from,
      // wastage_date_to,
      // product_id,
      // branch_id,
      // cost_center_id,
      // category_id,
      // sub_category_id,
      // unit_id,
      omitEmptyParams,
    ], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/wastage-summary`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
