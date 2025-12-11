import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllUsersProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllUsers = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllUsersProps) => {
  const { getParams } = useManageUrl();
  const { page, search, branch_id } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: ["get-users-query", page, search, branch_id],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/user`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
