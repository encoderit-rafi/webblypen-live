import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllTransferBranchSummaryProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllTransferBranchSummary = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllTransferBranchSummaryProps) => {
  const { getParams } = useManageUrl();
  const {
    page,
    search,
    branch_id,
    transfer_date_from,
    transfer_date_to,
    received_date_from,
    received_date_to,
  } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: [
      "get-reports-transfer-branch-summary-query",
      // page,
      // search,
      // received_date_from,
      // received_date_to,
      // transfer_date_from,
      // transfer_date_to,
      // branch_id,
      omitEmptyParams,
    ], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/transfer-branch-summary`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
