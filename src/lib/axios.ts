import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import https from "https";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const allowInsecureSSL = process.env.ALLOW_INSECURE_SSL === "true";

const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: false,
  httpsAgent: allowInsecureSSL
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// 👇 Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  async (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response?.status === 401) {
      console.log("🚨 401 Unauthorized - Logging out...");
      
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      
      // Sign out the user
      await signOut({ callbackUrl: "/login", redirect: true });
    }
    
    // Return the error so it can be handled by the calling code
    return Promise.reject(error);
  }
);

export default api;
