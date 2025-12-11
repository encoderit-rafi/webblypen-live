import { FormType, OptionSchema } from "@/types/global";
import * as z from "zod";

export const PhysicalCountsSchema = z.object({
  unit_id: OptionSchema,
  quantity: z.union([z.number(), z.string()]),
});

// Full recipe schema
export const InventoryCountSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  product_id: z.union([z.number(), z.string()]).optional(),
  inventory_count_id: z.union([z.number(), z.string()]).optional(),
  physical_counts: z.array(PhysicalCountsSchema),
});

export type InventoryCountSchemaType = z.infer<typeof InventoryCountSchema>;
export type PhysicalCountsSchemaType = z.infer<typeof PhysicalCountsSchema>;
export type InventoryCountFormType = FormType & {
  data: InventoryCountSchemaType;
};
