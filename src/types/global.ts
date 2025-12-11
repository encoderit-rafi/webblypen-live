import { ReactNode } from "react";
import * as z from "zod";
import { Control, FieldErrors } from "react-hook-form";

//ZOD
export const OptionSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().optional(),
  label: z.string().optional(),
  value: z.string().optional(),
});
export type OptionSchemaType = z.infer<typeof OptionSchema>;
//* UNIT
export const GlobalUnitSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().nullable().optional(),
  min_unit_name: z.string().nullable().optional(),
  min_unit_code: z.string().nullable().optional(),
  min_unit_conversion_factor: z
    .union([z.string(), z.number()])
    .nullable()
    .optional(),
  is_active: z.union([z.string(), z.boolean()]).optional(),
});
export type GlobalUnitSchemaType = z.infer<typeof GlobalUnitSchema>;
//* BRANCH
export const GlobalBranchSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string(),
  branch_type_id: z.number().optional(),
  code: z.string().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  contact_person: z.string().nullable().optional(),
  tin_number: z.string().nullable().optional(),
  delivery_time: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  is_default: z.boolean().optional(),
  logo: z.string().nullable().optional(),
  manager_id: z.number().nullable().optional(),
});
export type GlobalBranchSchemaType = z.infer<typeof GlobalBranchSchema>;
// Category schema
export const GlobalCategorySchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  code: z.string(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  is_active: z.boolean(),
  parent_id: z.union([z.string(), z.number()]).nullable().optional(),
  created_by: z.union([z.string(), z.number()]),
  updated_by: z.union([z.string(), z.number()]),
  parent: z
    .object({
      id: z.union([z.string(), z.number()]),
      name: z.string(),
    })
    .optional(),
});
export type GlobalCategorySchemaType = z.infer<typeof GlobalCategorySchema>;

export const GlobalProductSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  ideal_recovery_rate: z.union([z.string(), z.number()]).optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  type: z.string().optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  low_stock_threshold: z.union([z.string(), z.number()]).optional(),
  category_id: z.union([z.string(), z.number()]).optional(),
  is_active: z.boolean().optional(),
  is_default: z.boolean().optional(),
  category: GlobalCategorySchema.optional(),
  product_units: z.array(GlobalUnitSchema).optional(),
});
export type GlobalProductSchemaType = z.infer<typeof GlobalProductSchema>;
export type ActionsType = {
  type: string;
  label: string;
  show: boolean;
  icon: ReactNode;
  variant: "destructive" | "default";
  action: () => void;
};

export const ProductOptionsSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),

  name: z.string().optional(),
  code: z.string().optional(),
  type: z.string().optional(),
  vat: z.union([z.number(), z.string()]).optional(),
  default_unit_id: z.union([z.number(), z.string()]).optional(),
  default_unit_price: z.union([z.number(), z.string()]).optional(),
  avg_price: z.union([z.number(), z.string()]).optional(),

  ideal_batch_size: z.union([z.number(), z.string()]).optional(),
  ideal_recovery_rate: z.union([z.number(), z.string()]).optional(),
  is_useable_for_item: z.boolean().optional(),
  batch_items: z
    .array(
      z.object({
        id: z.union([z.number(), z.string()]).optional(),
        main_product_id: z.string(),
        product_id: z.string(),
        quantity: z.string(),
        unit_id: z.string(),

        product: z.object({
          id: z.union([z.number(), z.string()]).optional(),
          name: z.string(),
          code: z.string(),
        }),
        unit: z.object({
          id: z.union([z.number(), z.string()]).optional(),
          name: z.string(),
          code: z.string(),
        }),
      })
    )
    .optional(),
  default_unit: z
    .object({
      id: z.union([z.number(), z.string()]),
      name: z.string(),
      code: z.string(),
      conversion_factor: z.union([z.number(), z.string()]).optional(), // present in `units`
    })
    .optional(), // single unit object
  units: z
    .array(
      z.object({
        id: z.union([z.number(), z.string()]),
        name: z.string(),
        code: z.string(),
        conversion_factor: z.union([z.number(), z.string()]).optional(), // present in `units`
      })
    )
    .optional(), // list of units
});

export type ProductOptionsSchemaType = z.infer<typeof ProductOptionsSchema>;

export type ProductType = "General" | "Intermediate";
export type GlobalPropsType = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export type FormType = {
  type:
    | "view"
    | "default"
    | "create"
    | "update"
    | "delete"
    | "permission"
    | "create_po"
    | "update_po"
    | "delete_po";
  title?: string;
  description?: string;
  buttonText: string;
};
export type TForm = {
  type: "default" | "view" | "create" | "update" | "delete";
  title?: string;
  description?: string;
  buttonText: string;
  data?: {
    id: string | number;
  };
};
export type GlobalFormType = {
  type:
    | "default"
    | "view"
    | "create"
    | "update"
    | "delete"
    | "create_po"
    | "update_po";
  id?: string | number;
  title?: string;
  description?: string;
};
export type ModalType = {
  open: boolean;
  onOpenChange: () => void;
};
export type URLParamsType = {
  page?: number;
  per_page?: number;
  role?: string;
  status?: string;
  search?: string;
};
export type ControlDropdownProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
};
