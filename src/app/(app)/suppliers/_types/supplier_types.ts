import * as z from "zod";
import { FormType } from "@/types/global";
export const SupplierSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, "Name is required"),
  // email: z.string().email("Invalid email"),
  email: z.string().optional(),
  phone: z.string().min(10, "Phone number is required"),
  // contact_person: OptionSchema.optional(),
  contact_person: z.string().optional(),
  contact_number: z.string().optional(),
  telephone_number: z.string().optional(),
  tin_number: z.string().min(1, "TIN is required"),
  address: z.string().optional(),
  payment_info: z.string().optional(),
  is_active: z.boolean(),
  w_tax: z.union([z.number(), z.string()]),
});

export type SupplierSchemaType = z.infer<typeof SupplierSchema>;

// export type SupplierFormType = FormType & {
//   data: SupplierSchemaType;
// };
