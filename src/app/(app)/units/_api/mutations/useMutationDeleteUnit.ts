import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { UnitSchemaType, UnitType } from "../../_types/unit_types";

export const useMutationDeleteUnit = () => {
  return useMutation({
    mutationKey: ["delete-unit"],
    mutationFn: (body: Pick<UnitSchemaType, "id">) =>
      api.delete(`/units/${body.id}`),
  });
};
