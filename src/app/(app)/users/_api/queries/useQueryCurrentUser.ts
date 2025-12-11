import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useQueryCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      return (await api.get("/profile"))?.data?.data;
    },
  });

  return {
    ...query,
  };
};
