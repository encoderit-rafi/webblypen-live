import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TPurchasesDropdownParams = {
  search?: string;
  po_number?: string | number;
  branch_id?: string | number;
  supplier_id?: string | number;
  status?: string | number;
  created_at_to?: string | number;
  created_at_form?: string | number;
  search_received_items?: string | number;
  requested_by?: string | number;
  approved_by?: string | number;
  received_by?: string | number;
};
type TProps = GlobalPropsType & {
  params?: TPurchasesDropdownParams;
};
export const useQueryGetAllPurchasesDropdown = ({
  enabled = true,
  params,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-purchases-dropdown-query", params],
    enabled,
    queryFn: async () => {
      return (
        await api.get(`/purchases/dropdown`, {
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
