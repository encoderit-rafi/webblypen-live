import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toFormData } from "@/utils/toFormData";
import { IngredientSchemaType } from "../../_types/ingredient_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateIngredient = () => {
  return useMutation({
    mutationKey: ["create-ingredient"],
    mutationFn: (body: IngredientSchemaType) => {
      const data = omitEmpty({
        // id: body?.id,
        generic_name: body.generic_name,
        name: body.name,
        code: body.code,
        description: body.description,
        low_stock_threshold: body.low_stock_threshold,
        category_id: body.category.id,
        sub_category_id: body?.sub_category?.id,
        default_unit_id: body.default_unit.id,
        cost_center_id: body.cost_center.id,
        supplier_id: body.supplier.id,
        default_unit_price: body.default_unit_price,
        vat: body.vat,
        is_useable_for_item: body.is_useable_for_item || false,
        ideal_recovery_rate: body.ideal_recovery_rate || 0,
        type: "General",
      });
      // const payload =
      //   data.image instanceof File
      //     ? toFormData({ ...data, image: data.image })
      //     : data;
      const payload = data;

      return api.post("/products", payload);
    },
  });
};
