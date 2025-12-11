import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TUsersDropdownParams = {
  search?: string;
  role?: string;
};
type TProps = GlobalPropsType & {
  params?: TUsersDropdownParams;
};
export const useQueryGetAllUsersDropdown = ({
  enabled = true,
  params,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-users-list-dropdown-query", params],
    enabled,

    queryFn: async () => {
      return (
        await api.get(`/user/list`, {
          params: omitEmpty({
            ...params,
          }),
        })
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
