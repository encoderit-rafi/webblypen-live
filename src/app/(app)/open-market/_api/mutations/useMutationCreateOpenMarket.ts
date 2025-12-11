import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { OpenMarketSchemaType } from "../../_types/open_market_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateOpenMarket = () => {
  return useMutation({
    mutationKey: ["create-open-market"],
    mutationFn: (body: OpenMarketSchemaType) => {
      const payload = omitEmpty({
        id: body.id,
        branch_id: body.branch.id,
        supplier_id: body.supplier.id,
        omp_number: body.omp_number,
        purchase_date: body.purchase_date,
        note: body.note,
        total_amount: body.total_amount,
        vat_amount: body.vat_amount,
        items: body.items?.map((item) => ({
          product_id: item.product.id,
          unit_id: item.unit.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          vat: item.vat,
          total_price: item.total_price,
        })),
      });
      return api.post("/open-market-purchases", payload);
    },
  });
};
