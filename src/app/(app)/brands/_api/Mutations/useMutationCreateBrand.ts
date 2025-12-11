import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { BrandSchemaType } from "../../_types/brand_types";
import { omitEmpty } from "@/lib/utils";
import { toFormData } from "@/utils/toFormData";

export const useMutationCreateBrand = () => {
  return useMutation({
    mutationKey: ["create-brand"],
    mutationFn: (body: BrandSchemaType) => {
      const data = omitEmpty({
        ...body,
        branch_type_id: body.branch_type?.id,
        is_active: body.is_active ? 1 : 0,
        is_default: body.is_default ? 1 : 0,
      });
      const payload =
        data.image instanceof File
          ? toFormData({ ...data, image: data.image })
          : data;

      return api.post("/brands", payload);
    },
  });
};
