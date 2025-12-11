"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { FormInput } from "@/components/forms/FormInput";
import { RoleFormType, RoleSchema, RoleSchemaType } from "../_types/role_types";
import { useMutationCreateRole } from "../_api/mutations/useMutationCreateRole";
import { omitEmpty } from "@/lib/utils";
import { toast } from "sonner";
import { useMutationUpdateRole } from "../_api/mutations/useMutationUpdateRole";
import { ModalType } from "@/types/global";
import AppDialog from "@/components/base/AppDialog";

type RoleFormProps = ModalType & {
  formData: RoleFormType;
};

export default function RoleForm({
  open,
  onOpenChange,
  formData,
}: RoleFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleSchemaType>({
    resolver: zodResolver(RoleSchema),
    defaultValues: formData.data,
  });
  const { mutate: createRole, isPending } = useMutationCreateRole();
  const { mutate: updateRole, isPending: isPendingUpdateRole } =
    useMutationUpdateRole();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (formData?.data) {
      const omit = omitEmpty(formData?.data);
      reset(omit);
    }
  }, [open, formData.data, reset]);
  const onSubmit = (formValues: RoleSchemaType) => {
    const cleaned = omitEmpty({
      ...formValues,
      id: formData.data.id,
    }) as RoleSchemaType;
    formData.type === "create" &&
      createRole(cleaned, {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["get-roles-query"] });
          toast.success("Role is created successfully!");
          onOpenChange();
        },
        onError(error) {
          if (isAxiosError(error)) {
            console.error(
              "Error creating role:",
              error.response?.data?.message
            );
            toast.error(
              error.response?.data?.message || "Failed to create role."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      });
    formData.type === "update" &&
      updateRole(cleaned, {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["get-roles-query"] });
          toast.success("Role is updated successfully!");
          onOpenChange();
        },
        onError(error) {
          if (isAxiosError(error)) {
            console.error(
              "Error updating role:",
              error.response?.data?.message
            );
            toast.error(
              error.response?.data?.message || "Failed to update role."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      });
  };

  return (
    <AppDialog
      open={open}
      title={formData.title || ""}
      buttonText={formData.buttonText}
      isPending={isPending || isPendingUpdateRole}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <FormInput
          name="name"
          label="Role"
          placeholder="Enter role name"
          errors={errors}
          control={control}
        />
      </div>
    </AppDialog>
  );
}
