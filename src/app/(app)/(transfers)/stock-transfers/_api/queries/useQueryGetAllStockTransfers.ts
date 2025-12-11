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
  transfer_date_from?: string | number;
  transfer_date_to?: string | number;
  branch_id_for_in_out?: string | number;
};
type TProps = GlobalPropsType & {
  params?: TSuppliersDropdownParams;
};

export const useQueryGetAllStockTransfers = ({
  enabled = true,
  refetchOnMount = true,
}: TProps) => {
  const { getParams } = useManageUrl();
  // const {
  //   search,
  //   page,
  //   from_branch_id,
  //   to_branch_id,
  //   transfer_date_from,
  //   transfer_date_to,
  //   branch_id_for_in_out,
  // } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: [
      "get-stock-transfers-query",
      // search,
      // page,
      // from_branch_id,
      // to_branch_id,
      // transfer_date_from,
      // transfer_date_to,
      // branch_id_for_in_out,
      omitEmptyParams,
    ],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/transfers`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
