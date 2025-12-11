import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { UnitSchemaType } from "../../_types/unit_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateUnit = () => {
  return useMutation({
    mutationKey: ["update-unit"],
    mutationFn: (body: UnitSchemaType) => {
      const payload = omitEmpty({
        ...body,
      });
      return api.post(`/units/${body.id}`, { ...payload, _method: "PUT" });
    },
  });
};
