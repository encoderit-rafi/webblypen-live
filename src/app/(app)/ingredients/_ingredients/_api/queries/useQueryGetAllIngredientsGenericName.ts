import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { GlobalPropsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";

export type TParams = {
  search?: string;
};
type TProps = GlobalPropsType & {
  params?: TParams;
};
export const useQueryGetAllIngredientsGenericName = ({
  enabled = true,
  params,
}: TProps) => {
  const query = useQuery({
    queryKey: ["get-ingredients-generic-name-query", params], // <-- include reactive params in key
    enabled,
    refetchOnMount: "always",
    queryFn: async () => {
      return (
        await api.get(`/products/generic`, {
          params: omitEmpty({
            ...params,
          }),
        })
      ).data?.data;
    },
  });

  return { ...query };
};
