import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { UnitConversionSchemaType } from "../../_types/convert_unit_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateUnitConversion = () => {
  return useMutation({
    mutationKey: ["update-unit-conversion"],
    mutationFn: (body: UnitConversionSchemaType) => {
      const payload = omitEmpty({
        id: body.id,
        product_id: Number(body.product_id.id),
        base_unit_id: Number(body.base_unit_id.value),
        conversion_unit_id: Number(body.product_id.default_unit_id),
        conversion_factor: body.conversion_factor,
        _method: "PUT",
      });

      return api.post(`/product-unit-conversions/${payload.id}`, payload);
    },
  });
};
