import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type DeleteOpenMarketType = {
  id?: string | number;
};
export const useMutationDeleteOpenMarket = () => {
  return useMutation({
    mutationKey: ["delete-open-market"],
    mutationFn: (body: DeleteOpenMarketType) =>
      api.delete(`/open-market-purchases/${body.id}`),
  });
};
