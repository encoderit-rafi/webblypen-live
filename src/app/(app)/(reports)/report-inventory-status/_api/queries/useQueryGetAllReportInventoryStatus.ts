import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllReportInventoryStatusProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllReportInventoryStatus = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllReportInventoryStatusProps) => {
  const { getParams } = useManageUrl();
  const {
    page,
    search,
    branch_id,
    start_date,
    end_date,
    product_id,
    category_id,
    sub_category_id,
  } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: [
      "get-reports-inventory-status-query",
      // page,
      // search,
      // branch_id,
      // start_date,
      // end_date,
      // product_id,
      // category_id,
      // sub_category_id,
      omitEmptyParams,
    ], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/inventory/status`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
