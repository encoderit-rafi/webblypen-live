import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { SupplierSchemaType } from "../../_types/supplier_types";

export const useMutationDeleteSupplier = () => {
  return useMutation({
    mutationKey: ["delete-supplier"],
    mutationFn: (body: Pick<SupplierSchemaType, "id">) =>
      api.delete(`/suppliers/${body.id}`),
  });
};
