import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TCostCenterDropdownParams = {
  search?: string;
};
type TProps = GlobalPropsType & {
  params?: TCostCenterDropdownParams;
};
export const useQueryGetAllCostCentersDropdown = ({
  enabled = true,
  params,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-cost-centers-dropdown-query", params],
    enabled,
    queryFn: async () => {
      return (
        await api.get(`/cost-centers/list`, {
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
