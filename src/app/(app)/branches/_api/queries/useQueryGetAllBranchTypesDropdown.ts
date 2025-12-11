import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TBranchTypesDropdownParams = {
  search?: string;
  role?: string;
};
type TProps = GlobalPropsType & {
  params?: TBranchTypesDropdownParams;
};
export const useQueryGetAllBranchTypesDropdown = ({
  enabled = true,
  params,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-branch-type-dropdown-query"],
    enabled,
    queryFn: async () => {
      return (
        await api.get(`/branch-types/list`, {
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
