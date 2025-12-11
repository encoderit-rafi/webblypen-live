import { FormType, OptionSchema } from "@/types/global";
import * as z from "zod";

export type CategoryParentNode = {
  id: string | number;
  parent_id: string | number | null;
  name: string;
  code: string | null;
  description: string;
  image: string | File | null;
  is_active: "0" | "1";
};
export type CategoryAPINode = CategoryParentNode & {
  children_recursive?: CategoryParentNode[];
};

export const CategorySchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .or(z.literal(null)),
  is_active: z.boolean(),
  parent_id: z.union([z.number(), z.string()]).nullable().optional(),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;
export type CategoryNode = CategorySchemaType & {
  children_recursive?: CategorySchemaType[];
};
export type CategoryFormType = FormType & {
  data: CategorySchemaType;
};
