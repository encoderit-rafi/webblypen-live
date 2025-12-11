import { z } from "zod";
import { FormType, OptionSchema } from "@/types/global"; // adjust path as needed

// ✅ Safe File schema (works on server + client)
const FileSchema = typeof File !== "undefined" ? z.instanceof(File) : z.any();

export type SelectOption = {
  label: string;
  value: string | number;
};

export const InvoiceSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  purchase_id: z.union([z.number(), z.string()]).nullable().optional(),
  po_number: z.union([z.number(), z.string()]).optional(),

  inv_doc_from_supplier: z.union([FileSchema, z.string(), z.null()]).optional(),

  bank_doc: z.union([FileSchema, z.string(), z.null()]).optional(),

  invoice_number: z.string().min(1, "Invoice number is required"),
  invoice_date: z.string().min(1, "Invoice date is required"),
  due_date: z.string().min(1, "Due date is required"),
  // vat: z.number().min(0, "VAT must be a non-negative number"),
  total_amount: z.union([z.number(), z.string()]),

  // supplier_id: OptionSchema,
  // branch_id: OptionSchema,
  // supplier_id: z.union([z.number(), z.string()]),
  // branch_id: z.union([z.number(), z.string()]),

  // invoice_category: OptionSchema.optional(),
  invoice_category: OptionSchema,
  supplier: OptionSchema.nullable().optional(),
  invoiceCategory: OptionSchema.optional(),
  branch: OptionSchema.optional(),
  purchase: z
    .object({
      po_number: z.union([z.number(), z.string()]),
    })
    .nullable()
    .optional(),

  payment_info: z.string().optional(),
  note: z.string().optional(),
  status: z.number().optional(),
});

export type InvoiceSchemaType = z.infer<typeof InvoiceSchema>;

export type InvoiceType = {
  id?: string | number;
  invoice_number: string;
  invoice_category_id: number;
  branch_id: number;
  supplier_id: number;
  invoice_date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  status: number;
  vat: number;
  total_amount: number;
  note: string | null;
  bank_doc: File | string | null; // ✅ accept File or uploaded URL
  inv_doc_from_supplier: File | string | null; // ✅ same here
  created_by: number;
  updated_by: number;
};

// export type InvoiceFormType = FormType & {
//   id?: string | number;
//   data: InvoiceSchemaType;
// };
