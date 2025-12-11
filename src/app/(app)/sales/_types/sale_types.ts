import * as z from "zod";
import { FormType, OptionSchema } from "@/types/global";
import { FileMetadata } from "@/hooks/use-file-upload";

export const SaleSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  branch: OptionSchema,
  file: z
  .custom<File | FileMetadata>((val) => val === null || val instanceof File)
  .refine((val) => val !== null, { message: "file is required" }),
});

export type SaleSchemaType = z.infer<typeof SaleSchema>;

export type SaleType = {
  id?: string | number | undefined;
  branch_id:string | number;
  file:  File | FileMetadata | null;
}

// export type SalePayload = {
//   id?: string | number | undefined;
//   branch_id: string | number;
//   file: File | FileMetadata | null;
// }

export type SaleFormType = FormType &{
  data: SaleSchemaType;
};
