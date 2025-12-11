import * as z from "zod";
import { FormType, OptionSchema } from "@/types/global";

export const WastageSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  branch: OptionSchema,
  product: OptionSchema,
  unit: OptionSchema,
  quantity: z.union([z.number(), z.string()]).optional(),
  reason: z.string().optional(),
});

export type WastageSchemaType = z.infer<typeof WastageSchema>;

// export type WastageFormType = FormType & {
//   data: WastageSchemaType;
// };
