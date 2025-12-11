// import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllCategoriesProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllCategories = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllCategoriesProps) => {
  const { getParams } = useManageUrl();
  const { page, search } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams,
  });

  const query = useQuery({
    queryKey: ["get-categories-query", page, search],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/categories`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
