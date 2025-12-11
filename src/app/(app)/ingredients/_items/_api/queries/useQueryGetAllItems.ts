import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllItemsProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllItems = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllItemsProps) => {
  const { getParams } = useManageUrl();

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: ["get-items-query", omitEmptyParams], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/products`, {
          params: { ...omitEmptyParams, type: "Intermediate" },
        })
      ).data?.data;
    },
  });

  return { ...query };
};
