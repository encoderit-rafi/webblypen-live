import { FormType } from "@/types/global";
import * as z from "zod";

export const PermissionSchema = z.object({
  role: z.string(),
  permissions: z.array(z.number()).default([]).optional(),
});

export type PermissionType = {
  id: number;
  name: string;
  type: string;
};
export type PermissionFormType = FormType & {
  data: PermissionSchemaType;
};
export type PermissionSchemaType = z.infer<typeof PermissionSchema>;
