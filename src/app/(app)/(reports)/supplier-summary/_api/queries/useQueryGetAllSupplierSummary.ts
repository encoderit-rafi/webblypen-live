import { SEARCH_PARAMS } from "@/data/global_data";
import { useManageUrl } from "@/hooks/use-manage-url";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type GetAllSupplierSummaryProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useQueryGetAllSupplierSummary = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllSupplierSummaryProps) => {
  const { getParams } = useManageUrl();
  const {
    page,
    search,
    received_date_from,
    received_date_to,
    expected_delivery_date_from,
    expected_delivery_date_to,
    purchase_date_from,
    purchase_date_to,
    supplier_id,
  } = getParams;

  const omitEmptyParams = omitEmpty({
    ...getParams, // <-- now reactive
    per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: [
      "get-reports-supplier-summary-query",
      // page,
      // search,
      // received_date_from,
      // received_date_to,
      // expected_delivery_date_from,
      // expected_delivery_date_to,
      // purchase_date_from,
      // purchase_date_to,
      // supplier_id,
      omitEmptyParams,
    ], // <-- include reactive params in key
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/reports/supplier-summary-report`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });

  return { ...query };
};
