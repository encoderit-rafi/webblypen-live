import * as z from "zod";
import { FormType } from "@/types/global";

export const CostCenterSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, { message: "Name is required" }),
});

export type CostCenterSchemaType = z.infer<typeof CostCenterSchema>;

export type CostCenterFormType = FormType & {
  data: CostCenterSchemaType;
};
