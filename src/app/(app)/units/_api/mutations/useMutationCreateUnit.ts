import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

import { UnitSchemaType } from "../../_types/unit_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateUnit = () => {
  return useMutation({
    mutationKey: ["create-unit"],
    mutationFn: (body: UnitSchemaType) => {
      const payload = omitEmpty({
        ...body,
      });
      return api.post("/units", payload);
    },
  });
};
