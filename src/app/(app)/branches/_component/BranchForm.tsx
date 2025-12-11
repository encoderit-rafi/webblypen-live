"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { FormInput } from "@/components/forms/FormInput";
// import { omitEmpty } from "@/lib/utils";
import FormTextarea from "@/components/forms/FormTextarea";
import AppDialog from "@/components/base/AppDialog";
// import FormSingleSelect from "@/components/forms/FormSingleSelect";
// import FormMultiSelect from "@/components/forms/FormMultiSelect";

import { useMutationCreateBranch } from "../_api/mutations/useMutationCreateBranch";
import { useMutationUpdateBranch } from "../_api/mutations/useMutationUpdateBranch";
// import { useQueryGetAllUsersDropdown } from "../../users/_api/queries/useQueryGetAllUsersDropdown";

import {
  BranchSchema,
  BranchSchemaType,
  // BranchType,
  // BranchFormType,
} from "../_types/branch_types";
import { GlobalFormType } from "@/types/global";

// import { useQueryGetAllSuppliersDropdown } from "../../suppliers/_api/queries/useQueryGetAllSuppliersDropdown";
// import { useQueryGetAllBranchTypesDropdown } from "../_api/queries/useQueryGetAllBranchTypesDropdown";
import ControlUserDropdown from "@/components/control_dropdowns/ControlUserDropdown";
import ControlBranchTypeDropdown from "@/components/control_dropdowns/ControlBranchTypeDropdown";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQueryGetAllBranchTypesDropdown } from "../_api/queries/useQueryGetAllBranchTypesDropdown";
import { useQueryGetBranch } from "../_api/queries/useQueryGetBranch";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Button } from "@/components/ui/button";
import BaseSelect from "@/components/base/BaseSelect";
import { omitEmpty, showErrors } from "@/lib/utils";
// import FormDatePicker from "@/components/forms/FormDatePicker";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;

export default function BranchForm({ id = "", type, onCancel }: TProps) {
  const form = useForm<BranchSchemaType>({
    resolver: zodResolver(BranchSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;
  console.log("👉 ~ BranchForm ~ errors:", errors);
  const { data, isLoading: isLoadingBranch } = useQueryGetBranch({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });
  useEffect(() => {
    if (type === "create") {
      setValue("is_active", true);
      setValue("is_default", false);
    }
  }, [type]);
  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);
      reset(omit);
    }
  }, [data, reset, type]);
  const { data: branchTypes, isLoading: isLoadingBranchTypes } =
    useQueryGetAllBranchTypesDropdown({});
  const queryClient = useQueryClient();
  const { mutate: createBranch, isPending } = useMutationCreateBranch();
  const { mutate: updateBranch, isPending: isPendingUpdateBranch } =
    useMutationUpdateBranch();

  // useEffect(() => {
  //   if (formData?.data) reset(formData.data);
  // }, [open, formData.data, reset]);

  // console.log({ formData });

  // update all select options

  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Branch created successfully!"
        : "Branch updated successfully!"
    );
    queryClient.invalidateQueries({ queryKey: ["get-branches-query"] });
    queryClient.invalidateQueries({ queryKey: ["get-branch-data"] });
    reset();
    onCancel();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create branch."
        : "Failed to update branch.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: BranchSchemaType) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";

    (isCreate ? createBranch : updateBranch)(
      { ...values, id: isCreate ? undefined : id },
      {
        onSuccess: () => onSuccess(action),
        onError: (e) => onError(action, e),
      }
    );
  };
  const isLoading = isLoadingBranch || isLoadingBranchTypes;
  const isSubmitting = isPending || isPendingUpdateBranch;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <Spinner variant="bars" />
      </div>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="name"
            label="Branch"
            placeholder="Enter branch name"
            errors={errors}
            control={control}
          />
          <FormInput
            name="code"
            label="Code"
            placeholder="Enter branch code"
            errors={errors}
            control={control}
          />

          <FormInput
            type="email"
            name="email"
            label="Email"
            placeholder="name@example.com"
            errors={errors}
            control={control}
          />

          <FormInput
            name="phone"
            label="Phone"
            placeholder="+123-456-789"
            errors={errors}
            control={control}
          />
          <FormInput
            name="contact_person"
            label="Contact Person"
            placeholder="Enter a name"
            control={control}
            errors={errors}
          />
          <FormInput
            label="Delivery Time"
            name="delivery_time"
            placeholder="Enter delivery time"
            control={control}
            errors={errors}
          />
          {/* <ControlBranchTypeDropdown
            name="branch_type"
            label="Branch Type"
            placeholder="Select a branch type"
            control={control}
            errors={errors}
          /> */}
          <FormField
            control={control}
            name={`branch_type`}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Branch Type</FormLabel>
                <FormControl>
                  <BaseSelect
                    placeholder="Select a branch type"
                    options={branchTypes}
                    fieldState={fieldState}
                    value={field.value?.id ? String(field.value.id) : ""}
                    onValueChange={(val) => {
                      if (!!val) {
                        const selected = branchTypes.find(
                          (b: { id: string | number; name: string }) =>
                            String(b.id) == val
                        );
                        field.onChange(selected);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormInput
          name="tin_number"
          label="TIN Number"
          placeholder="Enter TIN number"
          errors={errors}
          control={control}
        />
        <FormTextarea
          name="address"
          label="Address"
          placeholder="Enter your address"
          errors={errors}
          control={control}
        />
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
