import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { LoginSchemaType } from "../../_types/login_types";

export const useLogin = () => {
  return useMutation({
    mutationKey: ["/login"],
    mutationFn: (body: LoginSchemaType) => api.post("/login", body),
  });
};
