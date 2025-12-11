import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllTransferItemsTrackProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryDownloadTransferItemsTrack = ({
  enabled = false,
  refetchOnMount = true,
}: GetAllTransferItemsTrackProps) => {
  const { getParams } = useManageUrl();
  delete getParams.page;
  delete getParams.per_page;
  const omitEmptyParams = omitEmpty({
    ...getParams,
  });
  const query = useQuery({
    queryKey: ["get-reports-transfer-items-track-export-query"],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/transfer-items-track/export`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
