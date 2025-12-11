import { FORM_DATA } from "@/data/global_data";
import { RoleFormType } from "../_types/role_types";
import { PermissionFormType } from "../_types/permission_types";

export const INITIAL_ROLE_FORM_DATA: RoleFormType = {
  ...FORM_DATA,
  data: {
    name: "",
  },
};
export const INITIAL_PERMISSION_FORM_DATA: PermissionFormType = {
  ...FORM_DATA,
  data: {
    role: "",
    permissions: [],
  },
};
