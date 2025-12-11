import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";

export type TCategoriesDropdownParams = {
  search?: string;
  parent_id?: string | number;
  parent_category?: string;
};
type TProps = GlobalPropsType & {
  params?: TCategoriesDropdownParams;
};
export const useQueryGetAllCategoriesDropdown = ({
  enabled = true,
  params,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-all-categories-dropdown-query", params],
    enabled,
    queryFn: async () => {
      return (
        await api.get(`/categories/list`, {
          params: omitEmpty({
            ...params,
          }),
        })
      ).data?.data;
    },
  });

  return { ...query };
};
