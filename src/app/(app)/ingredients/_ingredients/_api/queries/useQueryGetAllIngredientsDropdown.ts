import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TIngredientsDropdownParams = {
  search?: string;
  type?: string;
  unit_id?: string | number;
  brand_id?: string | number;
  branch_id?: string | number;
  supplier_id?: string | number;
  category_id?: string | number;
  inventory_unit_id?: string | number;
  inventory_brand_id?: string | number;
  inventory_branch_id?: string | number;
  item_type?: string;
  without_batch?: string;
  without_key?: string;
  without_general?: string;
  is_useable_for_item?: string | number;
  // // per_page?: number;
  // // is_active?: boolean | string;
};
type TProps = GlobalPropsType & {
  params?: TIngredientsDropdownParams;
};
export const useQueryGetAllIngredientsDropdown = ({
  enabled = true,
  params,
}: // refetchOnMount = true,

TProps) => {
  // const [params, setParams] = useState<ParamsType>(params);
  const query = useQuery({
    queryKey: ["get-ingredients-dropdown-query", params],
    enabled,
    queryFn: async () => {
      return (
        await api.get(`/products/list`, {
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
