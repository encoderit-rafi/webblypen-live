import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { BranchSchemaType } from "../../_types/branch_types";

export const useMutationDeleteBranch = () => {
  return useMutation({
    mutationKey: ["delete-branch"],
    mutationFn: (body: Pick<BranchSchemaType, "id">) =>
      api.delete(`/branches/${body.id}`),
  });
};
