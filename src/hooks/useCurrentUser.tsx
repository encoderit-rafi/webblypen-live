import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function injectToken(token: string | undefined) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: ["currentUser", session?.token],
    enabled: status === "authenticated" && !!session?.token, // 👈 Won't run without session & token
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    queryFn: async () => {
      if (!session?.token) return null; // 👈 Extra safety check

      injectToken(session.token);

      const res = await api.get("/profile");
      const user = res.data.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return user;
    },
    initialData: () => {
      if (typeof window === "undefined") return undefined;

      // 👇 Only return cached data if session exists
      if (!session?.token) return null; // Return null, not cached data

      try {
        const cached = localStorage.getItem("user");
        if (cached) {
          const parsedUser = JSON.parse(cached);
          injectToken(session.token);
          return parsedUser;
        }
        return undefined;
      } catch {
        return undefined;
      }
    },
  });

  // Handle errors
  useEffect(() => {
    if (query.error) {
      const error = query.error as any;
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.clear();
          window.location.reload();
        }
      }
    }
  }, [query.error]);

  // Only fetch on first authenticated session (when no cached data exists)
  useEffect(() => {
    // 👇 Triple check: session, token, authenticated status
    if (session?.token && status === "authenticated" && !query.data) {
      query.refetch();
    }
  }, [session?.token, status]);

  // 👇 Return null for user if not authenticated
  return {
    data: status === "authenticated" && session?.token ? query.data : null,
    isLoading: query.isLoading || status === "loading",
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isAuthenticated: status === "authenticated" && !!session?.token,
  };
};