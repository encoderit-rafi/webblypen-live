"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import UserForm from "./_component/UserForm";
import { Button } from "@/components/ui/button";
import AppTable from "@/components/base/AppTable";
import AppSearch from "@/components/base/AppSearch";
import { UserSchemaType } from "./_types/user_types";
import { AppPagination } from "@/components/base/AppPagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { GLOBAL_FORM_DATA } from "./_data/data";
import { useQueryGetAllUsers } from "./_api/queries/useQueryGetAllUsers";
import AppActionsDropdown from "@/components/base/AppActionsDropdown";
import { GLOBAL_FORM_DATA, ICON_ATTRS } from "@/data/global_data";
import { ActionsType, GlobalFormType } from "@/types/global";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import { useMutationDeleteUser } from "./_api/mutations/useMutationDeleteUser";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import AppStatusToggle from "@/components/base/AppStatusToggle";
import { useMutationUpdateUserStatus } from "./_api/mutations/useMutationUpdateUserStatus";
import AppStatus from "@/components/base/AppStatus";
import { getImageSrc } from "@/utils/getImageSrc";
// import UserCard from "@/components/base/cards/UserCard";
import BranchDropdown from "@/components/dropdowns/BranchDropdown";
import { useManageUrl } from "@/hooks/use-manage-url";
import { BaseFilter } from "@/components/base/BaseFilter";
import BaseDialog from "@/components/base/BaseDialog";

export default function Users() {
  const { setParams, getParams } = useManageUrl();
  const { branch_id } = getParams;
  const queryClient = useQueryClient();
  // const [formData, setFormData] = useState<UserFormType>(GLOBAL_FORM_DATA);
  const [formData, setFormData] = useState<GlobalFormType>(GLOBAL_FORM_DATA);
  const [userID, setUserID] = useState<string | number | null>(null);
  const { data, status } = useQueryGetAllUsers({});

  type UsersAPIType = (typeof data.data)[number];

  const { mutate: deleteUser, isPending: isPendingDeleteUser } =
    useMutationDeleteUser();
  const { mutate: updateUserStatus, isPending: isPendingUpdateUserStatus } =
    useMutationUpdateUserStatus();

  function handelUserStatusToggle(user: UserSchemaType) {
    const isActive = user.status;
    updateUserStatus(
      { id: user.id || "", status: !isActive },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-users-query"],
          });
          toast.success(
            // `User ${!isActive ? "activated" : "deactivated"} successfully!`
            `${user.name} ${
              !isActive ? "activated" : "deactivated"
            } successfully!`
          );
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update user status."
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      }
    );
  }
  const columns: ColumnDef<UsersAPIType>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (props) => {
        const data = props.cell.row.original;
        const name = String(data.name);
        const avatar = String(data.avatar);
        const img_src = getImageSrc(avatar) || "";
        const fallbackName = name.slice(0, 2);

        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={img_src} />
              <AvatarFallback className="uppercase size-8 text-xs">
                {fallbackName}
              </AvatarFallback>
            </Avatar>
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Branch",
      accessorKey: "branch.name",
      cell: (props) => props.getValue() as string,
    },
    {
      header: "Role",
      accessorKey: "user_role",
      cell: (props) => {
        const role = props.getValue() as string;
        if (role) {
          return <Badge variant={"secondary"}>{role.replace(/-/g, " ")}</Badge>;
        } else {
          return <Badge variant={"destructive"}>No Role</Badge>;
        }
      },
    },
    {
      header: "Active",
      accessorKey: "status",
      cell: (props) => {
        const data = props.cell.row.original;
        const user = {
          id: data.id,
          status: props.getValue() as boolean,
        };
        return (
          <AppStatusToggle
            isLoading={userID == user.id && isPendingUpdateUserStatus}
            isActive={props.getValue() as boolean}
            onToggle={() => {
              setUserID(user.id || null);
              handelUserStatusToggle(data);
            }}
          />
        );
      },
    },
    {
      header: "Actions",
      cell: (props) => {
        const data = props.cell.row.original;
        // const role = String(props.cell.row.original.user_role);
        const Actions = [
          // {
          //   type: "view",
          //   label: "view",
          //   variant: "default",
          //   show: true,
          //   // show: data.status_label != "Received",
          //   icon: <Eye {...ICON_ATTRS} />,
          //   action: () => {
          //     setFormData({
          //       type: "view",
          //       title: `View  User | ${data.name}`,
          //       id: data.id,
          //     });
          //   },
          // },
          {
            type: "edit",
            label: "Edit",
            variant: "default",
            show: true,
            icon: <SquarePen {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "update",
                title: `Update  | ${data.name}`,
                description: "update user",
                id: data.id,
              });
            },
          },
          {
            type: "delete",
            label: "Delete",
            variant: "destructive",
            show: true,
            icon: <Trash2 {...ICON_ATTRS} />,
            action: () => {
              setFormData({
                type: "delete",
                title: "Are you sure you?",
                description: `Are you sure you want to delete ${data.name}? All your data will be removed permanently.`,
                id: data.id,
              });
            },
          },
        ] as const satisfies readonly ActionsType[];
        const visibleActions = Actions.filter((item) => item.show);
        return (
          <AppActionsDropdown
            actions={visibleActions}
            disabled={!visibleActions.length}
          />
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="max-w-sm">
            <AppSearch />
          </div>
          <BaseFilter filters={["branch_id"]} />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setFormData({
              type: "create",
              title: "Create",
              description: "create  new user",
            })
          }
        >
          <Plus className="mr-2" />
          Add User
        </Button>
      </div>
      <AppStatus status={status} is_data={!!data?.data?.length}>
        <AppTable data={data?.data ?? []} columns={columns} />
        <AppPagination
          page={data?.meta?.current_page}
          lastPage={data?.meta?.last_page}
        />
      </AppStatus>
      {/* <UserCard
        title="User Details"
        open={formData.type === "view"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
        formData={formData}
      /> */}
      {/* <UserForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
        formData={formData}
      /> */}
      <BaseDialog
        title={formData?.title || ""}
        description={formData?.description || ""}
        component_props={{
          content: {
            className: "max-w-full sm:max-w-7xl",
          },
        }}
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(GLOBAL_FORM_DATA);
        }}
      >
        <UserForm
          type={formData.type}
          id={formData.id}
          onCancel={() => {
            setFormData(GLOBAL_FORM_DATA);
          }}
        />
      </BaseDialog>
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteUser}
        onOpenChange={() => setFormData(GLOBAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteUser(
            {
              id: formData.id,
            },
            {
              onSuccess(data) {
                console.log("✅ ~ onSuccess:::", data);
                queryClient.invalidateQueries({
                  queryKey: ["get-users-query"],
                });

                toast.success("User is deleted successfully!");
                setFormData(GLOBAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  toast.error(
                    error.response?.data?.message || "Failed to delete user."
                  );
                } else {
                  toast.error("Something went wrong.");
                }
              },
            }
          );
        }}
      />
    </div>
  );
}
