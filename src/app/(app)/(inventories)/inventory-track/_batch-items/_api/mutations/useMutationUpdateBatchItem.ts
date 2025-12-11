import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { BatchItemSchemaType } from "../../_types/batch_item_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateBatchItem = () => {
  return useMutation({
    mutationKey: ["update-daily-batch-item"],
    mutationFn: (body: BatchItemSchemaType) => {
      const data = omitEmpty({
        id: body?.id,
        branch_id: body.branch.id,
        batch_item_id: body.batch_item.id,
        batch_unit_id: body.batch_unit.id,
        batch_out_quantity: body.batch_out_quantity,
        product_id: body.product.id,
        unit_id: body.unit.id,
        product_in_quantity: body.product_in_quantity,
        note: body.note,
        _method: "PUT",
      });
      // const payload =
      //   data.image instanceof File
      //     ? toFormData({ ...data, image: data.image })
      //     : data;
      const payload = data;
      return api.post(`/daily-batch-items/${data.id}`, payload);
    },
  });
};
