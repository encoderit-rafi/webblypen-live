import { OptionSchema } from "@/types/global";
import * as z from "zod";

// Single ingredient schema
export const RecipeIngredientSchema = z.object({
  unit: OptionSchema,
  product: OptionSchema,
  quantity: z.union([z.number(), z.string()]),
});

// Full recipe schema
export const RecipeSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  // branch_id: OptionSchema,
  // recipe_category_id: OptionSchema,
  recipe_category: OptionSchema,
  price: z.union([z.number(), z.string()]),
  vat: z.union([z.number(), z.string()]).optional(),
  description: z.string().optional(),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .or(z.literal(null)),
  is_active: z.boolean().optional(),

  recipe_ingredients: z.array(RecipeIngredientSchema),
});

// Infer type directly from schema
export type RecipeSchemaType = z.infer<typeof RecipeSchema>;
export type RecipeIngredientType = z.infer<typeof RecipeIngredientSchema>;
// export type RecipeFormType = FormType & {
//   // id?: string | number;
//   data: RecipeSchemaType;
// };

// Final type for backend
// export type RecipeType = RecipeSchemaType;

// Form wrapper type

// For status updates
// export type RecipeStatusUpdateType = {
//   id?: string | number;
//   status: boolean;
// };
