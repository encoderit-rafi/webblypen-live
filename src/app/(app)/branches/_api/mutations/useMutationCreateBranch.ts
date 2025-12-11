import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { BranchSchemaType } from "../../_types/branch_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateBranch = () => {
  return useMutation({
    mutationKey: ["create-branch"],
    mutationFn: (body: BranchSchemaType) => {
      const payload = omitEmpty({
        name: body.name,
        branch_type_id: body.branch_type.id,
        code: body.code,
        phone: body.phone,
        email: body.email,
        tin_number: body.tin_number,
        contact_person: body.contact_person,
        // manager_id: body.manager?.id,
        address: body.address,
        delivery_time: body.delivery_time,
        is_active: body.is_active,
        is_default: body.is_default,
      });
      return api.post("/branches", payload);
    },
  });
};
