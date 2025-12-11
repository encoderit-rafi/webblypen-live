import { FormType, OptionSchema } from "@/types/global";
import * as z from "zod";
export const ProductSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  product: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  unit: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  quantity: z.union([z.number(), z.string()]),
});

export const ItemSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  // generic_name: OptionSchema,
  generic_name: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  code: z.string(),
  // type: z.string(), // Required
  description: z.string().optional(),
  // image: z
  //   .union([z.instanceof(File), z.string()])
  //   .optional()
  //   .or(z.literal(null)),
  low_stock_threshold: z.union([z.number(), z.string()]).optional(),
  category: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  sub_category: z
    .object({
      id: z.union([z.number(), z.string()]).optional(),
      name: z.string(),
    })
    .optional(),
  default_unit: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  cost_center: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  item_type: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  batch_items: z.array(ProductSchema).optional(),

  is_active: z.boolean().optional(),
  is_default: z.boolean().optional(),
});
export type ItemSchemaType = z.infer<typeof ItemSchema>;
export type ItemFormType = FormType & {
  data: ItemSchemaType;
};
