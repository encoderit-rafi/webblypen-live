import * as z from "zod";
import { FormType, OptionSchema, ProductOptionsSchema } from "@/types/global";

export const UnitConversionSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  product_id: ProductOptionsSchema,
  base_unit_id: OptionSchema,
  product: OptionSchema.optional(),
  base_unit: OptionSchema.optional(),
  conversion_factor: z.union([z.number(), z.string()]),
});

export type UnitConversionSchemaType = z.infer<typeof UnitConversionSchema>;

export type UnitConversionFormType = FormType & {
  data: UnitConversionSchemaType;
};
