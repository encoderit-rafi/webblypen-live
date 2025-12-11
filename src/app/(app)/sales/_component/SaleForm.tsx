"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { omitEmpty, showErrors } from "@/lib/utils";
import AppDialog from "@/components/base/AppDialog";
import { GlobalFormType, ModalType, OptionSchemaType } from "@/types/global";
import FormSingleSelect from "@/components/forms/FormSingleSelect";
import {
  SaleSchema,
  SaleSchemaType,
  SaleFormType,
  SaleType,
} from "../_types/sale_types";
import { useMutationCreateSale } from "../_api/Mutations/useMutationCreateSale";
import { useMutationUpdateSale } from "../_api/Mutations/useMutationUpdateSale";
import { useQueryGetAllBranchesDropdown } from "../../branches/_api/queries/useQueryGetAllBranchesDropdown";
import FormSingleExcelUploader from "@/components/forms/FormSingleExcelUploader";
import { useQueryCurrentUser } from "../../users/_api/queries/useQueryCurrentUser";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BaseSelect from "@/components/base/BaseSelect";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Button } from "@/components/ui/button";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;

export default function SaleForm({ id = "", type, onCancel }: TProps) {
  const form = useForm<SaleSchemaType>({
    resolver: zodResolver(SaleSchema),
    // defaultValues: data,
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;
  const { data: currentUser } = useQueryCurrentUser();
  const { branch_id: currentUserBranchID, branch: currentUserBranch } =
    currentUser ?? {};
  useEffect(() => {
    if (currentUserBranchID) {
      setValue("branch", currentUserBranch);
    }
  }, [currentUserBranchID]);
  const queryClient = useQueryClient();
  const { mutate: createSale, isPending } = useMutationCreateSale();
  const { mutate: updateSale, isPending: isPendingUpdateSale } =
    useMutationUpdateSale();
  const isSubmitting = isPending || isPendingUpdateSale;
  // useEffect(() => {
  //   if (data) {
  //     reset(data);
  //   }
  // }, [open, data, reset]);
  // console.log("Sale form Data", { formData });

  //fetch branches  for dropdown
  const { data: branches, isLoading } = useQueryGetAllBranchesDropdown({});

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Sale created successfully!"
        : "Sale updated successfully!"
    );
    queryClient.invalidateQueries({ queryKey: ["get-sales-query"] });
    reset();
    onCancel();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create" ? "Failed to create Sale." : "Failed to update Sale.";
    // if (isAxiosError(error)) {
    //   console.log("🚀 ~ onError ~ error:", error);
    //   // toast.error(error.response?.data?.message || fallback);
    //   toast.error(fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: SaleSchemaType) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    const payload: SaleType = omitEmpty({
      // id: isCreate ? undefined : id,
      branch_id: Number(values.branch.id),
      file: values.file ?? null,
    }) as SaleType;

    (isCreate ? createSale : updateSale)(payload, {
      onSuccess: () => onSuccess(action),
      onError: (e) => onError(action, e),
    });
    console.log("🚀 Final payload to backend:", payload);
  };
  console.log({ errors });
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormSingleExcelUploader
          name="file"
          control={control}
          setValue={setValue}
        />

        {/* Branch Name */}
        {/* <FormSingleSelect
          name="branch"
          label="Branch"
          placeholder="Select branch"
          control={control}
          errors={errors}
          options={branches?.map((type: OptionSchemaType) => ({
            id: type.id,
            value: String(type.id),
            label: type.name,
            name: type?.name,
          }))}
          loading={branchesLoading}
        /> */}
        {!Boolean(currentUserBranchID) && (
          <FormField
            control={control}
            name="branch"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <FormControl>
                  {isLoading ? (
                    <div className="flex items-center min-w-20 justify-center">
                      <Spinner variant="bars" />
                    </div>
                  ) : (
                    <BaseSelect
                      placeholder="Select a branch"
                      options={branches || []}
                      fieldState={fieldState}
                      value={field.value?.id ? String(field.value.id) : ""}
                      onValueChange={(val) => {
                        if (!!val) {
                          const selected = branches.find(
                            (b: { id: string | number; name: string }) =>
                              String(b.id) == val
                          );
                          field.onChange(selected);
                        }
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="min-w-24"
            onClick={() => {
              reset();
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} className="min-w-24">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
