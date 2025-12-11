import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllInventoryCountsProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllInventoryCounts = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllInventoryCountsProps) => {
  const { getParams } = useManageUrl();
  const {
    page,
    search,
    product_id,
    unit_id,
    brand_id,
    branch_id,
    physical_count_date_from,
    physical_count_date_to,
    category_id,
    sub_category_id,
  } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams,
    per_page: SEARCH_PARAMS.per_page,
  });
  const query = useQuery({
    queryKey: [
      "get-inventory-physical-counts-query",
      page,
      search,
      product_id,
      unit_id,
      brand_id,
      branch_id,
      physical_count_date_from,
      physical_count_date_to,
      category_id,
      sub_category_id,
    ],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/inventory/physical-count`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
