import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllPurchaseSummaryProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryDownloadPurchaseSummary = ({
  enabled = false,
  refetchOnMount = true,
}: GetAllPurchaseSummaryProps) => {
  const { getParams } = useManageUrl();
  delete getParams.page;
  delete getParams.per_page;
  const omitEmptyParams = omitEmpty({
    ...getParams,
  });
  const query = useQuery({
    queryKey: ["get-reports-purchase-summary-export-query"],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/purchase-summary/export`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
