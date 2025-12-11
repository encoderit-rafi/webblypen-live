import { FormType, OptionSchema, ProductOptionsSchema } from "@/types/global";
import { z } from "zod";
export const InventoryItemProductSchema = z.object({
  // product_id: OptionSchema,
  product_id: ProductOptionsSchema,
  unit_id: OptionSchema,
  unit_price: z.union([z.number(), z.string()]),

  quantity: z.union([z.number(), z.string()]),
  total_price: z.union([z.number(), z.string()]),
});
// Zod schema
export const InventoryItemSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  quantity: z.union([z.number(), z.string()]),
  cost_price: z.union([z.number(), z.string()]),
  branch_id: OptionSchema,
  product_id: OptionSchema,
  action: z.string(),
  daily_item_details: z.array(InventoryItemProductSchema),
});

export type InventoryItemSchemaType = z.infer<typeof InventoryItemSchema>;
export type InventoryItemProductSchemaType = z.infer<typeof InventoryItemProductSchema>;

export type InventoryItemFormType = FormType & {
  data: InventoryItemSchemaType;
};
