import { FormType, OptionSchema } from "@/types/global";
import * as z from "zod";

export const BatchItemSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  branch: OptionSchema,
  batch_item: OptionSchema.extend({
    batch_items: z
      .array(
        z.object({
          id: z.number(),
          main_product_id: z.string(),
          product_id: z.string(),
          quantity: z.string(),
          unit_id: z.string(),
          created_at: z.string().nullable(),
          updated_at: z.string().nullable(),
          product: z.object({
            id: z.number(),
            name: z.string(),
            code: z.string(),
          }),
          unit: z.object({
            id: z.number(),
            name: z.string(),
            code: z.string(),
          }),
        })
      )
      .optional(),
    ideal_batch_size: z.union([z.number(), z.string()]).optional(),
    default_unit: z
      .object({
        id: z.number(),
        name: z.string(),
        code: z.string(),
      })
      .optional(),
  }),
  batch_unit: OptionSchema,
  batch_out_quantity: z.union([z.number(), z.string()]),
  product: OptionSchema,
  unit: OptionSchema,
  product_in_quantity: z.union([z.number(), z.string()]),
  note: z.string().optional(),
});
export type BatchItemSchemaType = z.infer<typeof BatchItemSchema>;
// export type BatchItemFormType = FormType & {
//   data: BatchItemSchemaType;
// };
