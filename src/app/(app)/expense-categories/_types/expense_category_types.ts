import * as z from "zod";
import { FormType } from "@/types/global";

export const ExpenseCategorySchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, "Name is required"),
  is_active: z.boolean(),
  created_by: z.number().optional(),
  updated_by: z.number().optional(),
});

export type ExpenseCategorySchemaType = z.infer<typeof ExpenseCategorySchema>;

export type ExpenseCategoryType = {
  id?: string | number;
  name: string;
  is_active: boolean;
  avatar?: string | File | null | undefined;
  created_by?: number;
  updated_by?: number;
};

export type ExpenseCategoryFormType = FormType & {
  data: ExpenseCategorySchemaType;
};
export type ExpenseCategoryStatusUpdateType = {
  id?: string | number;
  status: boolean;
};
