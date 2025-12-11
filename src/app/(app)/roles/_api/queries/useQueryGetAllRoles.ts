import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useQueryGetAllRoles = () => {
  const query = useQuery({
    queryKey: ["get-roles-query"],
    enabled: true,
    queryFn: async () => {
      return (await api.get(`/role`)).data?.data;
    },
  });

  return {
    ...query,
  };
};
