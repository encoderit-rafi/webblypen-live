import { FORM_DATA } from "@/data/global_data";
import { CostCenterFormType } from "../_types/cost-center";

export const INITIAL_FORM_DATA: CostCenterFormType = {
  ...FORM_DATA,
  data: {
    name: "",
  },
};
