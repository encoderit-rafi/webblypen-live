import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
export type TSuppliersDropdownParams = {
  search?: string;
  page?: string | number;
  from_branch_id?: string | number;
  to_branch_id?: string | number;
  expense_date_from?: string | number;
  expense_date_to?: string | number;
  branch_id_for_in_out?: string | number;
};
type TProps = GlobalPropsType & {
  params?: TSuppliersDropdownParams;
};

export const useQueryGetAllExpenses = ({
  enabled = true,
  refetchOnMount = true,
}: TProps) => {
  const { getParams } = useManageUrl();

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: ["get-expenses-query", omitEmptyParams],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/expenses`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
