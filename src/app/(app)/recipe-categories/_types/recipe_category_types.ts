import * as z from "zod";
import { FormType } from "@/types/global";

export const RecipeCategorySchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  image: z.string().nullable().optional(),
  is_active: z.boolean(),
});

export type RecipeCategorySchemaType = z.infer<typeof RecipeCategorySchema>;

export type RecipeCategoryType = {
  id?: string | number;
  name: string;
  code: string;
  image: string | null;
  is_active: boolean;
  avatar?: string | File | null | undefined;
};

export type RecipeCategoryFormType = FormType & {
  data: RecipeCategorySchemaType;
};
export type RecipeCategoryStatusUpdateType = {
  id?: string | number;
  status: boolean;
};
