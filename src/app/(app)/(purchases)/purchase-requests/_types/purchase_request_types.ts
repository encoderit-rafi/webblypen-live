import { FormType, OptionSchema } from "@/types/global";
import * as z from "zod";
export const PurchaseRequestProductSchema = z.object({
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
});

export const PurchaseRequestSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  branch: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  supplier: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  pr_number: z.string().optional(),
  note: z.string().optional(),
  expected_delivery_date: z.string(),
  purchase_request_items: z.array(PurchaseRequestProductSchema),
});

export type PurchaseRequestSchemaType = z.infer<typeof PurchaseRequestSchema>;
export type PurchaseRequestProductSchemaType = z.infer<
  typeof PurchaseRequestProductSchema
>;

// export type PurchaseRequestFormType = FormType & {
//   data: PurchaseRequestSchemaType;
// };
