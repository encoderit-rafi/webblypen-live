import * as z from "zod";
const OpenMarketProductSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  product: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
    vat: z.union([z.number(), z.string()]).optional(),
    default_unit_price: z.union([z.number(), z.string()]).optional(),
  }),
  unit: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
    conversion_factor: z.union([z.number(), z.string()]).optional(),
    min_unit_conversion_factor: z.union([z.number(), z.string()]).optional(),
  }),
  quantity: z.union([z.number(), z.string()]),
  unit_price: z.union([z.number(), z.string()]),
  vat: z.union([z.number(), z.string()]),
  total_price: z.union([z.number(), z.string()]),
});
export const OpenMarketSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  omp_number: z.union([z.number(), z.string()]).optional(),
  note: z.string().optional(),
  branch: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  supplier: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  purchase_date: z.string(),
  vat_amount: z.union([z.number(), z.string()]).optional(),
  total_amount: z.union([z.number(), z.string()]).optional(),
  items: z.array(OpenMarketProductSchema),
});

export type OpenMarketSchemaType = z.infer<typeof OpenMarketSchema>;
