import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { CategorySchemaType } from "../../_types/category_types";

export const useMutationDeleteCategory = () => {
  return useMutation({
    mutationKey: ["delete-category"],
    mutationFn: (body: CategorySchemaType) =>
      api.delete(`/categories/${body.id}`),
  });
};
