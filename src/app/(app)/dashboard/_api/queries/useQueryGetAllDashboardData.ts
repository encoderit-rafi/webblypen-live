import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// import { useQuery } from "@tanstack/react-query";
type GetAllDashboardDataProps = {
enabled: boolean;
refetchOnMount?: boolean;
};
export const useQueryGetAllDashboardData = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllDashboardDataProps) => {
  //  const { getParams } = useManageUrl();
    // const { page, search } = getParams;
  
    // const omitEmptyParams = omitEmpty({
    //   ...getParams,
    //   per_page: SEARCH_PARAMS.per_page,
    // }); 
    const query = useQuery({
    // queryKey: ["get-dashboard-query", page, search],
    queryKey: ["get-dashboard-query"],
    enabled,
    refetchOnMount,
    queryFn: async () => {
      return (
        await api.get(`/dashboard`)
      ).data?.data;
    },
  });

  return {
    ...query,
  };
};
