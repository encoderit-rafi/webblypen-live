import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useQueryGetAllRolesDropdown = (isEnabled: boolean) => {
  const query = useQuery({
    queryKey: ["get-roles-dropdown-query"],
    enabled: isEnabled,
    queryFn: async () => {
      return (await api.get(`/role/list`)).data?.data;
    },
  });

  return {
    ...query,
  };
};
