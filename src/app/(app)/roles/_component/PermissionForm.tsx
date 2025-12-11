"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryGetAllPermissions } from "../_api/queries/useQueryGetAllPermissions";
import {
  PermissionFormType,
  PermissionSchema,
  PermissionSchemaType,
  PermissionType,
} from "../_types/permission_types";
import { ModalType } from "@/types/global";
import { useMutationUpdateRolePermissions } from "../_api/mutations/useMutationUpdateRolePermissions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type RoleFormProps = ModalType & {
  formData: PermissionFormType;
};

export default function PermissionForm({
  open,
  onOpenChange,
  formData,
}: RoleFormProps) {
  const { handleSubmit, reset, setValue } = useForm<PermissionSchemaType>({
    resolver: zodResolver(PermissionSchema),
    defaultValues: formData.data,
  });

  const { data: permissions, status } = useQueryGetAllPermissions(
    formData.type === "permission"
  );
  const queryClient = useQueryClient();

  const { mutate: updateRolePermissions, isPending } =
    useMutationUpdateRolePermissions();

  const [selectedPermissionIDs, setSelectedPermissionIDs] = useState<number[]>(
    formData.data.permissions || []
  );

  useEffect(() => {
    setValue("permissions", selectedPermissionIDs);
  }, [selectedPermissionIDs]);
  useEffect(() => {
    if (formData?.data) {
      reset(formData.data);
      setSelectedPermissionIDs(formData.data.permissions || []);
    }
  }, [open, formData.data, reset]);

  const onSubmit = (formValues: PermissionSchemaType) => {
    updateRolePermissions(formValues, {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["get-roles-query"] });
        toast.success("Role is created successfully!");
        onOpenChange();
      },
      onError(error) {
        if (isAxiosError(error)) {
          console.error("Error creating role:", error.response?.data?.message);
          toast.error(
            error.response?.data?.message || "Failed to create role."
          );
        } else {
          toast.error("Something went wrong.");
        }
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
    >
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(700px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base capitalize">
            {formData.title}
          </DialogTitle>
          <div className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    {status == "pending"
                      ? "Loading..."
                      : Object.entries(
                          permissions as Record<string, PermissionType[]>
                        ).map(([groupName, permissionList]) => (
                          <div
                            key={groupName}
                            className="flex flex-col gap-1.5"
                          >
                            <Label className="capitalize bg-muted p-1.5 rounded-sm">
                              {groupName.replace(/_/g, " ")}
                            </Label>
                            <div className="grid grid-cols-1 gap-4 p-1.5">
                              {permissionList.map((perm: PermissionType) => (
                                <div
                                  key={perm.id}
                                  className={`text-wrap whitespace-normal flex items-center space-x-1.5 `}
                                >
                                  <Checkbox
                                    id={perm.name}
                                    checked={selectedPermissionIDs.some(
                                      (id) => id == perm.id
                                    )}
                                    onCheckedChange={(data) => {
                                      if (data) {
                                        selectedPermissionIDs?.length > 0
                                          ? setSelectedPermissionIDs((old) => [
                                              ...old,
                                              perm.id,
                                            ])
                                          : setSelectedPermissionIDs([perm.id]);
                                      } else {
                                        setSelectedPermissionIDs(
                                          (old) =>
                                            old.filter(
                                              (id) => id !== perm.id
                                            ) || []
                                        );
                                      }
                                    }}
                                  />
                                  <Label htmlFor={perm.name} className="">
                                    {perm.name.replace(/_/g, " ")}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                  </div>
                </form>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="border-t px-6 py-4 sm:items-center">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="min-w-24"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="min-w-24"
            onClick={handleSubmit(onSubmit)}
            loading={isPending}
          >
            {formData.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
