import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllExpenseCategoryProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllExpenseCategories = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllExpenseCategoryProps) => {
  const { getParams } = useManageUrl();
  const { page, search } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
  });
  const query = useQuery({
    queryKey: ["get-expense-categories-query", page, search],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/expense-categories`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
