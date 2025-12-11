import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { PurchaseRequestSchemaType } from "../../_types/purchase_request_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreatePurchaseRequest = () => {
  return useMutation({
    mutationKey: ["create-purchase-request"],
    mutationFn: (body: PurchaseRequestSchemaType) => {
      const payload = omitEmpty({
        branch_id: body.branch.id,
        supplier_id: body.supplier.id,
        expected_delivery_date: body.expected_delivery_date,
        note: body.note,
        purchase_request_items: body.purchase_request_items?.map((item) => ({
          product_id: item.product.id,
          unit_id: item.unit.id,
          quantity: item.quantity,
          unit_price:
            +(item.product.default_unit_price || 1) *
            +(item.unit.conversion_factor || 1),
          vat: item.product.vat,
          total_price:
            Number(item.product.default_unit_price) *
              Number(item.unit.conversion_factor || 1) *
              Number(item.quantity) || 0,
        })),
      });

      return api.post("/purchase-requests", payload);
    },
  });
};
