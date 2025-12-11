import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { InventorySchemaType } from "../../_types/inventory_types";
import { omitEmpty } from "@/lib/utils";
// import { InventoryType } from "../../_types/inventory_types";

export const useMutationAdjustProductInventory = () => {
  return useMutation({
    mutationKey: ["adjust-product-inventory"],
    mutationFn: (body: InventorySchemaType) => {
      const payload = omitEmpty({
        branch_id: body.branch_id.id,
        product_id: body.product_id.id,
        // brand_id: body.brand_id.id,
        quantity: body.quantity,
        action: "add",
      });

      return api.post("/inventory/adjust/stock", payload);
    },
  });
};
