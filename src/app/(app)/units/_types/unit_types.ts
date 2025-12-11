import { FormType } from "@/types/global";
import * as z from "zod";


export const UnitSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  is_active: z.boolean(),
});

export type UnitSchemaType = z.infer<typeof UnitSchema>;
export type UnitType = {
  status: boolean;
  id?: string | number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_by?: number;
  updated_by?: number;
  avatar?: string | File | null;
};
export type UnitFormType =  FormType &{
  data: UnitSchemaType;
}

export type UnitStatusUpdateType = {
  id?: string | number;
  status: boolean;
};
