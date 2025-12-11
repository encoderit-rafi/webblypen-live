import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllTransferItemsTrackProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllTransferItemsTrack = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllTransferItemsTrackProps) => {
  const { getParams } = useManageUrl();
  const {
    page,
    search,
    from_branch_id,
    to_branch_id,
    branch_id_for_in_out,
    status,
    transfer_date_from,
    transfer_date_to,
    received_date_from,
    received_date_to,
    requested_by,
    approved_by,
    received_by,
  } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: [
      "get-reports-purchase-summary-query",
      // page,
      // search,
      // from_branch_id,
      // to_branch_id,
      // branch_id_for_in_out,
      // status,
      // transfer_date_from,
      // transfer_date_to,
      // received_date_from,
      // received_date_to,
      // requested_by,
      // approved_by,
      // received_by,
      omitEmptyParams,
    ], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/transfer-items-track`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
