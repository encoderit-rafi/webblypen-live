import { FormType, OptionSchema } from "@/types/global";
import * as z from "zod";
export const UserSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  avatar: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .or(z.literal(null)),
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  status: z.boolean(),
  // branch_id: z.number().optional(),

  // branch_id: OptionSchema.refine(
  //   (val) => val.label !== "" && val.value !== "",
  //   {
  //     message: "Branch is required",
  //   }
  // ),
  // branch_id: OptionSchema.optional(),
  branch: z
    .object({
      id: z.union([z.number(), z.string()]).optional(),
      name: z.string(),
    })
    .optional(),
  user_role: z
    .object({
      id: z.union([z.number(), z.string()]).optional(),
      name: z.string(),
    })
    .optional(),
  // user_role: OptionSchema.refine(
  //   (val) => val.value !== "" && val.value !== "",
  //   {
  //     message: "Role is required",
  //   }
  // ),
});

export const UserSearchSchema = z.object({
  name: OptionSchema,
  email: OptionSchema,
  user_role: z.string().optional(),
  branch_id: z.union([z.string(), z.number()]).optional(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;

export type UserSearchType = z.infer<typeof UserSearchSchema>;

// export type UserFormType = FormType & {
//   data: UserSchemaType;
// };
