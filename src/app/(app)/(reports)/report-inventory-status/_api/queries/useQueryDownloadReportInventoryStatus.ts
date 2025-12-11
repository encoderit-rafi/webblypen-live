import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllReportInventoryStatusProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryDownloadReportInventoryStatus = ({
  enabled = false,
  refetchOnMount = true,
}: GetAllReportInventoryStatusProps) => {
  const { getParams } = useManageUrl();
  delete getParams.page;
  delete getParams.per_page;
  const omitEmptyParams = omitEmpty({
    ...getParams,
  });
  const query = useQuery({
    queryKey: ["get-reports-inventory-status-download-query"], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/inventory/status/export`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
