import * as z from "zod";
import { FormType, OptionSchema } from "@/types/global";

export const BranchSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, { message: "Name is required" }),
  code: z.string().min(1, { message: "Code is required" }),
  tin_number: z.string().min(1, { message: "TIN Number is required" }),
  // manager: OptionSchema.nullable().optional(),
  contact_person: z.string().nullable().optional(),
  branch_type: OptionSchema,
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is too short"),
  address: z.string().min(1, "Address is required"),
  delivery_time: z.string().optional(),
  is_default: z.boolean(),
  is_active: z.boolean(),
});

export type BranchSchemaType = z.infer<typeof BranchSchema>;

// export type BranchFormType = FormType & {
//   data: BranchSchemaType;
// };
