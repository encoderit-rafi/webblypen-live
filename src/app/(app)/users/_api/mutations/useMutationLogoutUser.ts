import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
export const useMutationLogoutUser = () => {
  return useMutation({
    mutationKey: ["logout-user"],
    mutationFn: (body: string) => {
      return api.post(`/logout`);
    },
  });
};
