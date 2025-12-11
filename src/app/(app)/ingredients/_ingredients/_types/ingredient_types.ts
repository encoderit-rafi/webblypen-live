import { FormType, OptionSchema } from "@/types/global";
import * as z from "zod";

export const IngredientSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  // generic_name: OptionSchema,
  generic_name: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  code: z.string(),
  // type: z.string(), // Required
  description: z.string().optional(),
  low_stock_threshold: z.union([z.number(), z.string()]),
  category: OptionSchema,
  sub_category: OptionSchema.optional(),
  default_unit: OptionSchema,
  cost_center: OptionSchema,
  supplier: OptionSchema,
  default_unit_price: z.union([z.number(), z.string()]),
  vat: z.union([z.number(), z.string()]),
  is_active: z.boolean().optional(),
  is_useable_for_item: z.boolean().optional(),
  ideal_recovery_rate: z.union([z.number(), z.string()]).optional(),
});
export type IngredientSchemaType = z.infer<typeof IngredientSchema>;
// export type IngredientFormType = FormType & {
//   data: IngredientSchemaType;
// };
