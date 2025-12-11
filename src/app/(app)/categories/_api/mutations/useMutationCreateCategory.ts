import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toFormData } from "@/utils/toFormData";
import { CategorySchemaType } from "../../_types/category_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateCategory = () => {
  return useMutation({
    mutationKey: ["create-category"],
    mutationFn: (body: CategorySchemaType) => {
      console.log("🚀 ~ useMutationCreateCategory ~ body:", body);
      const payload = omitEmpty({
        ...body,
      });
      // const data =
      //   body.image instanceof File
      //     ? toFormData({ ...body, image: body.image })
      //     : body;
      // return;
      return api.post("/categories", payload);
    },
  });
};
