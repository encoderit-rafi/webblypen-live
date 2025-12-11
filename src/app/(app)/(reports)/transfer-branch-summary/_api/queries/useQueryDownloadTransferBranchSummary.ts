import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllTransferBranchSummaryProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryDownloadTransferBranchSummary = ({
  enabled = false,
  refetchOnMount = true,
}: GetAllTransferBranchSummaryProps) => {
  const { getParams } = useManageUrl();
  delete getParams.page;
  delete getParams.per_page;
  const omitEmptyParams = omitEmpty({
    ...getParams,
  });
  const query = useQuery({
    queryKey: ["get-reports-transfer-branch-summary-export-query"],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/transfer-branch-summary/export`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
