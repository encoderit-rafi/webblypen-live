import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TBrandsDropdownParams = {
  search?: string;
  product_id?: string | number;
  inventory_product_id?: string | number;
};
type TProps = GlobalPropsType & {
  params?: TBrandsDropdownParams;
};

export const useQueryGetAllBrandsDropdown = ({
  enabled = true,
  params,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-brands-dropdown-query", params],
    enabled,
    // refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/brands/list`, {
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
