import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordType } from "../_types/reset-password";

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ["password-reset"],
    mutationFn: (body: ResetPasswordType) => api.post("/password/reset", body),
  });
};
