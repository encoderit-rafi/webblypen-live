import { FormType, OptionSchema } from "@/types/global";
import * as z from "zod";

export const ExpenseSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string(),
  branch: OptionSchema,
  // branch_id: OptionSchema,
  // category: OptionSchema.optional(),
  // expense_category_id: OptionSchema,
  expense_category: OptionSchema,
  expense_date: z.string().optional(),
  amount: z.union([z.number(), z.string()]),
  status: z.number().optional(),
  vat_type: z.boolean().optional(),
  vat_amount: z.union([z.number(), z.string()]).optional(),
  expense_number: z.string().optional(),
  note: z.string().optional(),
});

export type ExpenseSchemaType = z.infer<typeof ExpenseSchema>;

export type ExpenseFormType = FormType & {
  data: ExpenseSchemaType;
};
