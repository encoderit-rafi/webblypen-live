import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { BranchSchemaType } from "../../_types/branch_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateBranchDefault = () => {
  return useMutation({
    mutationKey: ["update-branch-default"],
    mutationFn: (body: Pick<BranchSchemaType, "id" | "is_default">) => {
      const payload = omitEmpty({
        id: body.id,
        status: body.is_default,
      });
      return api.put(`/branches/update/default/${body.id}`, payload);
    },
  });
};
