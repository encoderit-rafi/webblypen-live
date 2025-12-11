"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/forms/FormInput";
import { useEffect } from "react";
import {
  // SupplierFormType,
  SupplierSchema,
  SupplierSchemaType,
} from "../_types/supplier_types";
import FormTextarea from "@/components/forms/FormTextarea";
import { useMutationCreateSupplier } from "../_api/mutations/useMutationCreateSupplier";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { GlobalFormType, ModalType } from "@/types/global";
import AppDialog from "@/components/base/AppDialog";
import { useMutationUpdateSupplier } from "../_api/mutations/useMutationUpdateSupplier";
import { INITIAL_FORM_DATA } from "../_data/data";
import { omitEmpty, showErrors } from "@/lib/utils";
import { useQueryGetSupplier } from "../_api/queries/useQueryGetSupplier";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;
export default function SupplierForm({ id = "", type, onCancel }: TProps) {
  const form = useForm<SupplierSchemaType>({
    resolver: zodResolver(SupplierSchema),
    // defaultValues: formData.data,
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;
  // const { type: type } = formData;
  // const watchFrom = watch();
  const { data, isLoading: isLoadingSupplier } = useQueryGetSupplier({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });
  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);

      reset(omit);
    }
  }, [data, reset, type]);
  const queryClient = useQueryClient();
  const { mutate: createSupplier, isPending } = useMutationCreateSupplier();
  const { mutate: updateSupplier, isPending: isPendingUpdateSupplier } =
    useMutationUpdateSupplier();

  // useEffect(() => {
  //   if (type !== "update") return;
  //   const omit = omitEmpty(formData.data);
  //   reset(omit);
  // }, [type]);
  useEffect(() => {
    if (type == "create") {
      setValue("is_active", true);
    }
  }, [type]);
  // useEffect(() => {
  //   if (open == false) {
  //     reset(INITIAL_FORM_DATA);
  //     // reset();
  //   }
  // }, [open]);

  // console.log("Supplier form Data", { formData });
  const onSuccess = (type: "create" | "update") => {
    toast.success(
      type === "create"
        ? "Supplier created successfully!"
        : "Supplier updated successfully!"
    );
    queryClient.invalidateQueries({ queryKey: ["get-suppliers-query"] });
    reset();
    onCancel();
  };

  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create Supplier."
        : "Failed to update Supplier.";
    // if (isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || fallback);
    // } else {
    //   toast.error("Something went wrong.");
    // }
    showErrors(error, fallback);
  };

  const onSubmit = (values: SupplierSchemaType) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";
    (isCreate ? createSupplier : updateSupplier)(values, {
      onSuccess: () => onSuccess(action),
      onError: (e) => onError(action, e),
    });
  };
  const isLoading = isLoadingSupplier;
  const isSubmitting = isPending || isPendingUpdateSupplier;
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
            label="Name"
            placeholder="Enter name"
            errors={errors}
            control={control}
          />
          <FormInput
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            errors={errors}
            control={control}
          />
          <FormInput
            name="phone"
            label="Phone"
            placeholder="Enter your phone"
            errors={errors}
            control={control}
          />
          <FormInput
            name="contact_person"
            label="Contact Person"
            placeholder="Enter your phone"
            errors={errors}
            control={control}
          />

          <FormInput
            name="contact_number"
            label="Contact Number"
            placeholder="Enter your phone"
            errors={errors}
            control={control}
          />
          <FormInput
            name="telephone_number"
            label="Telephone Number"
            placeholder="Enter your phone"
            errors={errors}
            control={control}
          />
          {/* <ControlUserDropdown
            name="contact_person"
            label="Contact Person"
            placeholder="Select a user"
            control={control}
            errors={errors}
          /> */}
          <FormInput
            name="tin_number"
            label="TIN"
            placeholder="Enter your TIN"
            control={control}
            errors={errors}
          />

          <FormInput
            name="w_tax"
            label="W Tax"
            placeholder="Enter your W_Tax"
            type="number"
            errors={errors}
            control={control}
          />
        </div>

        <FormTextarea
          name="payment_info"
          label="Payment Info"
          placeholder="Enter your payment info"
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
