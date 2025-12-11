import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { PurchaseOrderSchemaType } from "../../_types/purchase_order_types";
import { uniqueArray } from "@/utils/uniqueArray";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdatePurchaseOrder = () => {
  return useMutation({
    mutationKey: ["update-purchase-order"],
    mutationFn: (body: PurchaseOrderSchemaType) => {
      const purchaseItems = body.purchase_items.map((item) => ({
        product_id: Number(item.product.id),
        unit_id: Number(item.unit.id),
        request_quantity: Number(item.request_quantity) || 0,
        receive_quantity: Number(item.receive_quantity) || 0,
        unit_price: Number(item.unit_price),
        new_price: Number(item.unit_price) || "",
        vat: Number(item.vat) || 0,
        total_price: Number(item.total_price),
      }));

      // 🔹 Build the payload
      const payload = omitEmpty({
        id: Number(body.id),
        purchase_request_id: Number(body.purchase_request_id),
        po_number: null,
        supplier_id: Number(body.supplier.id),
        branch_id: Number(body.branch.id),
        purchase_date: body.purchase_date || null,
        expected_delivery_date: body.expected_delivery_date,
        note: body.note || null,
        vat_percentage: Number(body.vat_percentage) || 0,
        vat_amount: Number(body.vat_amount) || 0,
        w_tax_percentage: Number(body.w_tax_percentage) || 0,
        w_tax_amount: Number(body.w_tax_amount) || 0,
        non_vatable_amount: Number(body.non_vatable_amount) || 0,
        vatable_amount: Number(body.vatable_amount) || 0,
        total_amount: Number(body.total_amount) || 0,
        due_amount: Number(body.due_amount) || 0,
        purchase_items: purchaseItems,
        _method: "PUT",
      });
      return api.post(`/purchases/${payload.id}`, payload);
    },
  });
};
