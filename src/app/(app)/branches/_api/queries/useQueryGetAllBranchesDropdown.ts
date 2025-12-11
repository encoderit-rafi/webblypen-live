import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TBranchesDropdownParams = {
  search?: string;
  manager_id?: string | number;
  supplier_id?: string | number;
  branch_type_id?: string | number;
};
type TProps = GlobalPropsType & {
  params?: TBranchesDropdownParams;
};
export const useQueryGetAllBranchesDropdown = ({
  enabled = true,
  params,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-branches-dropdown-query", params],
    enabled,
    queryFn: async () => {
      return (
        await api.get(`/branches/list`, {
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
