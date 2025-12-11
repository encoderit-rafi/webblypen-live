import * as z from "zod";

import { FormType, OptionSchema } from "@/types/global";

export const BrandSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .or(z.literal(null)),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  branch_type: OptionSchema.optional(),
  is_active: z.boolean(),
  is_default: z.boolean(),
});

export type BrandSchemaType = z.infer<typeof BrandSchema>;

export type BrandType = {
  name?: string;
  description?: string;
  // image?: string | File | null | undefined;
  is_active?: boolean;
  is_default?: boolean;
  created_by?: number;
  updated_by?: number;
  id?: string | number | undefined;
  image?: string | File | null | undefined;
};

export const BrandSearchSchema = z.object( {
     image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .or(z.literal(null)),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
 
});

  export type BrandSearchType =z.infer<typeof   
BrandSearchSchema>;


export type BrandFormType = FormType & {
  data: BrandSchemaType;
};

export type BrandStatusUpdateType = {
  id?: string | number;
  status: boolean;
};

export type BrandDefaultUpdateType = {
  id?: string | number;
  status: boolean;
};
