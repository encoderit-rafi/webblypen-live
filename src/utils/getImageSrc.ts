import { BASE_URL } from "@/data/global_data";

export const getImageSrc = (avatar: string | null | undefined) => {
  if (!avatar) return null;
  return `${BASE_URL}/storage/${avatar}`;
};
