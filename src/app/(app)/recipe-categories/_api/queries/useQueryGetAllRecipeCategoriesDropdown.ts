import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";

export type TRecipeCategoriesDropdownParams = {
  search?: string;
  inventory_product_id?: string | number;
};
type TProps = GlobalPropsType & {
  params?: TRecipeCategoriesDropdownParams;
};

export const useQueryGetAllRecipeCategoriesDropdown = ({
    enabled = true,
  params,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-recipe-categories-dropdown-query"],
    enabled,
    queryFn: async () => {
      return (
        await api.get(`recipe-categories/list`, {
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