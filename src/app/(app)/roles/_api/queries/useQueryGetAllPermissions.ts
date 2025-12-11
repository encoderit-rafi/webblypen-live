"use client";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useQueryGetAllPermissions = (isEnabled: boolean) => {
  const query = useQuery({
    queryKey: ["get-permissions-query"],
    enabled: isEnabled,
    queryFn: async () => {
      {
        // const permissions = (await api.get(`/permissions`)).data?.data;
        return (await api.get(`/permissions`)).data?.data;
      }
    },
  });

  return {
    ...query,
  };
};
