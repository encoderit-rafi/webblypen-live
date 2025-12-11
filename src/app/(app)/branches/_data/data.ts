import { EMPTY_OPTIONS_DATA, FORM_DATA } from "@/data/global_data";
import { BranchSchemaType } from "../_types/branch_types";
// import { BranchFormType } from "../_types/branch_types";

export const INITIAL_FORM_DATA: BranchSchemaType = {
  id: "",
  name: "",
  code: "",
  tin_number: "",
  email: "",
  phone: "",
  address: "",
  contact_person: "",
  branch_type: EMPTY_OPTIONS_DATA,
  // manager: EMPTY_OPTIONS_DATA,
  is_active: true,
  is_default: false,
};
