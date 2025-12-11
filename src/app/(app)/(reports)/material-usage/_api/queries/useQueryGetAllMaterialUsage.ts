import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllMaterialUsageProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllMaterialUsage = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllMaterialUsageProps) => {
  const { getParams } = useManageUrl();
  const {
    page,
    search,
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
      "get-reports-material-usage-query",
      // page,
      // search,
      // start_date,
      // end_date,
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
        await api.get(`/reports/material-usage`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
