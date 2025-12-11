import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllPurchaseOrdersProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllPurchaseOrders = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllPurchaseOrdersProps) => {
  const { getParams } = useManageUrl();

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: ["get-purchase-orders-query", omitEmptyParams],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/purchases`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
