import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { BranchSchemaType } from "../../_types/branch_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateBranchStatus = () => {
  return useMutation({
    mutationKey: ["update-branch-status"],
    mutationFn: (body: Pick<BranchSchemaType, "id" | "is_active">) => {
      const payload = omitEmpty({
        id: body.id,
        status: body.is_active,
      });
      return api.put(`/branches/update/status/${body.id}`, payload);
    },
  });
};
