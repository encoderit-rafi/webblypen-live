import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { CategorySchemaType } from "../../_types/category_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateCategory = () => {
  return useMutation({
    mutationKey: ["update-category"],
    mutationFn: (body: CategorySchemaType) => {
      const payload = omitEmpty({
        ...body,
      });
      return api.post(`/categories/${body.id}`, { ...payload, _method: "PUT" });
    },
  });
};
