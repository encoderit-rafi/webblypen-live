import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { SupplierSchemaType } from "../../_types/supplier_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateSupplier = () => {
  return useMutation({
    mutationKey: ["update-supplier"],
    mutationFn: (body: SupplierSchemaType) => {
      const data = omitEmpty({
        id: body.id,
        name: body.name,
        contact_person: body.contact_person,
        contact_number: body.contact_number,
        telephone_number: body.telephone_number,
        email: body.email,
        phone: body.phone,
        address: body.address,
        is_active: true,
        tin_number: body.tin_number,
        w_tax: Number(body.w_tax),
        payment_info: body.payment_info,
        _method: "PUT",
      });

      const payload = data;
      return api.post(`/suppliers/${payload.id}`, payload);
    },
  });
};
