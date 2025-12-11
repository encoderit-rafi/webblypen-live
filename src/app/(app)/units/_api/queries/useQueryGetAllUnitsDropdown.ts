import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TUnitsDropdownParams = {
  search?: string;
  product_id?: string | number;
};
type TProps = GlobalPropsType & {
  params?: TUnitsDropdownParams;
};
export const useQueryGetAllUnitsDropdown = ({
  enabled = true,
  params,
}: // refetchOnMount = true,

TProps) => {
  const query = useQuery({
    queryKey: ["get-units-dropdown-query", params],
    enabled,
    queryFn: async () => {
      return (
        await api.get(`/units/list`, {
          params: omitEmpty({
            ...params,
            // type: "General",
          }),
        })
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
