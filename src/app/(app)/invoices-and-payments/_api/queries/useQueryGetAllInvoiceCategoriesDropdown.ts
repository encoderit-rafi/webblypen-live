import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TInvoiceCategoriesDropdownParams = {
  search?: string;
  // manager_id?: string | number;
  // supplier_id?: string | number;
  // branch_type_id?: string | number;
};
type TProps = GlobalPropsType & {
  params?: TInvoiceCategoriesDropdownParams;
};
export const useQueryGetAllInvoiceCategoriesDropdown = ({
  enabled = true,
  params,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-invoices-dropdown-query"],
    enabled,

    queryFn: async () => {
      return (
        await api.get(`/invoice-categories/list`, {
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
