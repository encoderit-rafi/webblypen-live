"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormInput } from "@/components/forms/FormInput";
import { GlobalFormType } from "@/types/global";
import FormSingleFileUploader from "@/components/forms/FormSingleFileUploader";
import { UserSchema, UserSchemaType } from "../_types/user_types";
import { useMutationCreateUser } from "../_api/mutations/useMutationCreateUser";
import { useMutationUpdateUser } from "../_api/mutations/useMutationUpdateUser";
import { useQueryGetAllRolesDropdown } from "../../roles/_api/queries/useQueryGetAllRolesDropdown";
import { useQueryGetAllBranchesDropdown } from "../../branches/_api/queries/useQueryGetAllBranchesDropdown";
import { useQueryCurrentUser } from "../_api/queries/useQueryCurrentUser";
import { useManageUrl } from "@/hooks/use-manage-url";
import { omitEmpty, showErrors } from "@/lib/utils";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BaseSelect from "@/components/base/BaseSelect";
import { useQueryGetUser } from "../_api/queries/useQueryGetUser";
import { Button } from "@/components/ui/button";

type TProps = {
  onCancel: () => void;
} & GlobalFormType;

export default function UserForm({ id = "", type, onCancel }: TProps) {
  useEffect(() => {
    if (type == "create") {
      setValue("status", true);
    }
  }, [type]);
  const { data, isLoading: isLoadingUser } = useQueryGetUser({
    enabled: type === "update" && !!id,
    id: id ?? "",
  });
  const { data: currentUser } = useQueryCurrentUser();
  const { branch_id: currentUserBranchID, branch: currentUserBranch } =
    currentUser ?? {};

  const form = useForm<UserSchemaType>({
    resolver: zodResolver(UserSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    // watch,
    formState: { errors },
  } = form;
  useEffect(() => {
    if (type === "update" && data) {
      const omit = omitEmpty(data);
      reset(omit);
    }
  }, [data, reset, type]);
  const { setParams } = useManageUrl();
  useEffect(() => {
    if (currentUserBranchID) {
      setValue("branch", currentUserBranch);
    }
  }, [currentUserBranchID]);
  const { data: roles, isLoading: isLoadingRoles } =
    useQueryGetAllRolesDropdown(type === "create" || type === "update");
  const { data: branches, isLoading: isLoadingBranch } =
    useQueryGetAllBranchesDropdown({
      enabled: type === "create" || type === "update",
    });

  const queryClient = useQueryClient();
  const { mutate: createUser, isPending } = useMutationCreateUser();
  const { mutate: updateUser, isPending: isPendingUpdateUser } =
    useMutationUpdateUser();

  const onSuccess = (type: "create" | "update") => {
    const message =
      type === "create"
        ? "User is created successfully!"
        : "User is updated successfully!";
    queryClient.invalidateQueries({ queryKey: ["get-users-query"] });
    queryClient.invalidateQueries({
      queryKey: ["get-users-list-dropdown-query"],
    });
    type === "create" && setParams({ page: 1 });
    toast.success(message);
    reset();
    onCancel();
  };
  const onError = (type: "create" | "update", error: Error) => {
    const fallback =
      type === "create"
        ? "Failed to create branch."
        : "Failed to update branch.";
    showErrors(error, fallback);
  };

  const onSubmit = (values: UserSchemaType) => {
    const isCreate = type === "create";
    const action: "create" | "update" = isCreate ? "create" : "update";
    (isCreate ? createUser : updateUser)(
      {
        ...values,
        id: isCreate ? undefined : id,
      },
      {
        onSuccess: () => onSuccess(action),
        onError: (err) => onError(action, err),
      }
    );
  };
  const isLoading = isLoadingUser;
  const isSubmitting = isPending || isPendingUpdateUser;

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
        <FormSingleFileUploader
          name="avatar"
          control={control}
          setValue={setValue}
          src={getValues("avatar") ? String(getValues("avatar")) : null}
          isSubmitting={isSubmitting}
        />
        <FormInput
          name="name"
          label="Name"
          placeholder="Enter your name"
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

        {type == "create" && (
          <FormField
            control={form.control}
            name="user_role"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  {isLoadingRoles ? (
                    <div className="flex items-center min-w-20 justify-center">
                      <Spinner variant="bars" />
                    </div>
                  ) : (
                    <BaseSelect
                      placeholder="Select a supplier"
                      options={roles || []}
                      fieldState={fieldState}
                      value={field.value?.id ? String(field.value.id) : ""}
                      onValueChange={(val) => {
                        if (!!val) {
                          const selected = roles.find(
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
        {!Boolean(currentUserBranchID) && (
          <FormField
            control={form.control}
            name="branch"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <FormControl>
                  {isLoadingBranch ? (
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
