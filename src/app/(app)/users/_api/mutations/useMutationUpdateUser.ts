import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { UserSchemaType } from "../../_types/user_types";
import { toFormData } from "@/utils/toFormData";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateUser = () => {
  return useMutation({
    mutationKey: ["update-user"],
    mutationFn: (body: UserSchemaType) => {
      const data = omitEmpty({
        ...body,
        user_role: body?.user_role?.name,
        branch_id: body?.branch?.id,
        _method: "PUT",
      });
      // delete data.avatar;
      const payload =
        data.avatar instanceof File
          ? toFormData({ ...data, avatar: data.avatar })
          : data;
      // const payload = data;
      return api.post(`/user/${data.id}`, payload);
    },
  });
};
