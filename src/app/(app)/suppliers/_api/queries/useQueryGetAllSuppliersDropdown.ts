import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TSuppliersDropdownParams = {
  search?: string;
  product_id?: string | number;
  brand_id?: string | number;
  branch_id?: string | number;
};
type TProps = GlobalPropsType & {
  params?: TSuppliersDropdownParams;
};
export const useQueryGetAllSuppliersDropdown = ({
  enabled = true,
  params,
}: // refetchOnMount = true,

TProps) => {
  const query = useQuery({
    queryKey: ["get-suppliers-dropdown-query", params],
    enabled,
    queryFn: async () => {
      return (
        await api.get(`/suppliers/list`, {
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
