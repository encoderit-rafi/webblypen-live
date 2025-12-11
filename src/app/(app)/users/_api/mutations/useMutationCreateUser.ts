import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { UserSchemaType } from "../../_types/user_types";
import { toFormData } from "@/utils/toFormData";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateUser = () => {
  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: (body: UserSchemaType) => {
      console.log("✅ ~ useMutationCreateUser ~ body:", body);
      // return;
      const data = omitEmpty({
        ...body,
        user_role: body?.user_role?.name,
        branch_id: body?.branch?.id,
      });
      const payload =
        data.avatar instanceof File
          ? toFormData({ ...data, avatar: data.avatar })
          : data;

      return api.post("/user", payload);
    },
  });
};
