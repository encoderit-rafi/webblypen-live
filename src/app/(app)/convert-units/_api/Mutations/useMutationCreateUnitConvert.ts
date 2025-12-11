import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

import { UnitConversionSchemaType } from "../../_types/convert_unit_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateUnitConversion = () => {
  return useMutation({
    mutationKey: ["create-unit-conversion"],
    mutationFn: (body: UnitConversionSchemaType) => {
      // console.log("🚀 ~ useMutationCreateUnitConversion ~ body:", body);
      // return;
      const payload = omitEmpty({
        // ...body,
        product_id: Number(body.product_id.id),
        base_unit_id: Number(body.base_unit_id.value),
        conversion_unit_id: Number(body.product_id.default_unit_id),
        conversion_factor: body.conversion_factor,
      });
      // return
      return api.post("/product-unit-conversions", payload);
    },
  });
};
