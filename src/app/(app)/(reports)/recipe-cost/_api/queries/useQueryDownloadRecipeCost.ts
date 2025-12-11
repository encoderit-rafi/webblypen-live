import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllRecipeCostProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryDownloadRecipeCost = ({
  enabled = false,
  refetchOnMount = true,
}: GetAllRecipeCostProps) => {
  const { getParams } = useManageUrl();
  delete getParams.page;
  delete getParams.per_page;
  const omitEmptyParams = omitEmpty({
    ...getParams,
  });
  const query = useQuery({
    queryKey: ["get-reports-recipe-cost-export-download-query"], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/recipe-cost/export`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
