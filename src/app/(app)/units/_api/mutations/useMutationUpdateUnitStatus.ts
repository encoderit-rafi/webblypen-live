import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { UnitSchemaType } from "../../_types/unit_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationUpdateUnitStatus = () => {
  return useMutation({
    mutationKey: ["update-unit-status"],
    mutationFn: (body: Pick<UnitSchemaType, "id" | "is_active">) => {
      const data = omitEmpty({
        ...body,
        status: body.is_active,
        _method: "PUT",
      });
      // delete data.avatar;
      const payload = data;
      return api.put(`/units/update/status/${body.id}`, payload);
    },
  });
};
