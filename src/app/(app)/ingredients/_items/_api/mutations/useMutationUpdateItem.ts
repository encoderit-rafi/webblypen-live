import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { omitEmpty } from "@/lib/utils";
import { ItemSchemaType } from "../../_types/item_types";

export const useMutationUpdateItem = () => {
  return useMutation({
    mutationKey: ["update-item"],
    mutationFn: (body: ItemSchemaType) => {
      const data = omitEmpty({
        id: body?.id,
        generic_name: body.generic_name,
        name: body.name,
        code: body.code,
        description: body.description,
        low_stock_threshold: body.low_stock_threshold,
        category_id: body.category.id,
        sub_category_id: body?.sub_category?.id,
        default_unit_id: body.default_unit.id,
        cost_center_id: body.cost_center.id,
        item_type: body.item_type.name,
        // ideal_batch_size: body.ideal_batch_size,
        batch_items: body.batch_items?.map((item) => ({
          product_id: item.product.id,
          unit_id: item.unit.id,
          quantity: item.quantity,
        })),
        type: "Intermediate",
        _method: "PUT",
      });
      // const payload =
      //   data.image instanceof File
      //     ? toFormData({ ...data, image: data.image })
      //     : data;
      const payload = data;
      return api.post(`/products/${body.id}`, payload);
    },
  });
};
