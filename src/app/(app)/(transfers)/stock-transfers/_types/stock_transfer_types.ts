import { FormType, OptionSchema, ProductOptionsSchema } from "@/types/global";
import * as z from "zod";
export const StockTransferProductSchema = z.object({
  product: ProductOptionsSchema,
  // brand: OptionSchema,
  unit: OptionSchema.extend({
    conversion_factor: z.union([z.number(), z.string()]).optional(),
  }),
  request_quantity: z.union([z.number(), z.string()]),
  receive_quantity: z.union([z.number(), z.string()]).optional(),
  unit_price: z.union([z.number(), z.string()]).optional(),
  total_price: z.union([z.number(), z.string()]).optional(),
});

export const StockTransferSchema = z.object({
  from_branch: OptionSchema,
  to_branch: OptionSchema,
  expected_delivery_date: z.string().optional(),
  transfer_date: z.string().optional(),
  note: z.string().optional(),
  id: z.union([z.number(), z.string()]).optional(),
  transfer_items: z.array(StockTransferProductSchema),
});

export type StockTransferSchemaType = z.infer<typeof StockTransferSchema>;
export type StockTransferProductSchemaType = z.infer<
  typeof StockTransferProductSchema
>;
