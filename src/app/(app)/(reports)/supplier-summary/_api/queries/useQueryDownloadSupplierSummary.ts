import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllSupplierSummaryProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryDownloadSupplierSummary = ({
  enabled = false,
  refetchOnMount = true,
}: GetAllSupplierSummaryProps) => {
  const { getParams } = useManageUrl();
  delete getParams.page;
  delete getParams.per_page;
  const omitEmptyParams = omitEmpty({
    ...getParams,
  });
  const query = useQuery({
    queryKey: ["get-reports-supplier-summary-export-query"],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/supplier-summary-report/export`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
