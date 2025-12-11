import { FormType, OptionSchema } from "@/types/global";
import { z } from "zod";

// Zod schema
export const InventorySchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  quantity: z.union([z.number(), z.string()]),
  branch_id: OptionSchema,
  product_id: OptionSchema,
  // action: z.string(),
});

export type InventorySchemaType = z.infer<typeof InventorySchema>;

export type InventoryFormType = FormType & {
  data: InventorySchemaType;
};
