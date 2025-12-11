import { FormType, OptionSchema } from "@/types/global";
import * as z from "zod";

export const PurchaseOrderProductSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  product: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
    // default_unit: z.union([z.number(), z.string()]).optional(),
    default_unit: z
      .object({
        id: z.union([z.number(), z.string()]).optional(),
        name: z.string(),
      })
      .optional(),
  }),
  unit: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  request_quantity: z.union([z.number(), z.string()]).optional(),
  receive_quantity: z.union([z.number(), z.string()]).optional(),
  unit_price: z.union([z.number(), z.string()]),
  new_price: z.union([z.number(), z.string()]).optional(),
  vat: z.union([z.number(), z.string()]),
  total_price: z.union([z.number(), z.string()]),
});

// PurchaseOrder create/update schema
export const PurchaseOrderSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  purchase_request_id: z.union([z.number(), z.string()]),
  supplier: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
    address: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    tin_number: z.string().optional(),
    w_tax: z.union([z.number(), z.string()]).optional(),
  }),
  //  supplier_id
  branch: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string(),
  }),
  // branch_id
  purchase_date: z.string().optional(),
  expected_delivery_date: z.string(),
  note: z.string().optional(),
  vat_percentage: z.union([z.number(), z.string()]),
  vat_amount: z.union([z.number(), z.string()]),
  w_tax_percentage: z.union([z.number(), z.string()]),
  w_tax_amount: z.union([z.number(), z.string()]),
  non_vatable_amount: z.union([z.number(), z.string()]),
  vatable_amount: z.union([z.number(), z.string()]),
  total_amount: z.union([z.number(), z.string()]),
  due_amount: z.union([z.number(), z.string()]),
  purchase_items: z.array(PurchaseOrderProductSchema),
});

export type PurchaseOrderSchemaType = z.infer<typeof PurchaseOrderSchema>;
export type PurchaseOrderProductSchemaType = z.infer<
  typeof PurchaseOrderProductSchema
>;
