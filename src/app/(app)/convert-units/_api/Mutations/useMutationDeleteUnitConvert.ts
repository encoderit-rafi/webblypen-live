import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { UnitConversionSchemaType } from "../../_types/convert_unit_types";



export const useMutationDeleteUnitConversion = () => {
  return useMutation({
    mutationKey: ["delete-Unit-conversion"],
    mutationFn: (body: UnitConversionSchemaType) => api.delete(`/product-unit-conversions/${body.id}`),
  });
};
