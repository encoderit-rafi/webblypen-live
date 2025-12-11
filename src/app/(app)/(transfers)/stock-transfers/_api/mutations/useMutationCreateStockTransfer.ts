import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { StockTransferSchemaType } from "../../_types/stock_transfer_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateStockTransfer = () => {
  return useMutation({
    mutationKey: ["create-stock-transfer"],
    mutationFn: (body: StockTransferSchemaType) => {
      // const payload = omitEmpty({
      //   ...body,
      //   from_branch_id: body?.from_branch_id?.id || "",
      //   to_branch_id: body.to_branch_id.id,
      //   transfer_items: body.transfer_items.map((item) => ({
      //     ...item,
      //     product_id: item.product_id.id,
      //     brand_id: item.brand_id.id,
      //     unit_id: item.unit_id.id,
      //   })),
      // });
      const payload = omitEmpty({
        // ...body,
        from_branch_id: body?.from_branch?.id || "",
        to_branch_id: body.to_branch.id,
        expected_delivery_date: body.expected_delivery_date,
        note: body?.note || "",
        transfer_items: body.transfer_items.map((item) => ({
          // ...item,
          product_id: item.product.id,
          // brand_id: item.brand.id,
          unit_id: item.unit.id,
          request_quantity: item.request_quantity,
          receive_quantity: item.receive_quantity,
        })),
      });

      return api.post("/transfers", payload);
    },
  });
};
