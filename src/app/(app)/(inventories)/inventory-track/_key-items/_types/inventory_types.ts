import {
  GlobalBranchSchema,
  GlobalProductSchema,
  GlobalUnitSchema,
} from "@/types/global";
import { z } from "zod";
const DetailsSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  product: z.object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string(),
    default_unit: z.object({
      id: z.union([z.string(), z.number()]).optional(),
      name: z.string(),
    }),
    default_unit_price: z.union([z.string(), z.number()]).optional(),
    cost_price: z.union([z.string(), z.number()]).optional(),
  }),
  out_quantity_per_unit: z.union([z.number(), z.string()]),
  out_ingredient_unit: GlobalUnitSchema.extend({
    conversion_factor: z.union([z.string(), z.number()]).optional(),
  }),
  total_out_quantity: z.union([z.number(), z.string()]),
  total_in_quantity: z.union([z.number(), z.string()]),
  cost_price: z.union([z.number(), z.string()]),
  unit: GlobalUnitSchema.extend({
    conversion_factor: z.union([z.string(), z.number()]).optional(),
  }).optional(),
});

export const InventoryDailyTrackSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  branch: GlobalBranchSchema,
  ingredient: GlobalProductSchema.extend({
    default_unit: GlobalUnitSchema.optional(),
    default_unit_price: z.union([z.string(), z.number()]).optional(),
  }),
  ingredient_unit: GlobalUnitSchema.extend({
    conversion_factor: z.union([z.string(), z.number()]).optional(),
  }),
  unit: GlobalUnitSchema.extend({
    conversion_factor: z.union([z.string(), z.number()]).optional(),
  }).optional(),
  total_out_quantity: z.union([z.number(), z.string()]),
  ideal_recovery_rate: z.union([z.number(), z.string()]),
  recovery_rate: z.union([z.number(), z.string()]),
  variance: z.union([z.number(), z.string()]),
  adjusted_variance: z.union([z.number(), z.string()]).optional(),
  details: z.array(DetailsSchema),
});

// --- Type Inference ---
export type InventoryDailyTrackSchemaType = z.infer<
  typeof InventoryDailyTrackSchema
>;
