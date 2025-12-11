import { FormType } from "@/types/global";
import * as z from "zod";
export const RoleSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string({ required_error: "Please enter your role name" }).min(1, {
    message: "Please enter your role name",
  }),
});

export type RoleType = {
  id: number | string;
  name: string;
  slug: string;
  guard_name: string;
  permission_ids: number[];
  permission_count: string;
  total_permission_count: string;
  user_count: string;
  can_assign_permission: boolean;
  deletable: boolean;
};

export type RoleFormType = FormType & {
  data: RoleSchemaType;
};
export type RoleSchemaType = z.infer<typeof RoleSchema>;
