import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordFormData } from "../page";
export const useForgetPassword = () => {
  return useMutation({
    mutationKey: ["password-forget"],
    mutationFn: (body: ForgotPasswordFormData) =>
      api.post("/password/forgot", body),
  });
};
