import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/lib/axios"; // your Axios instance
import type { NextAuthOptions, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const res = await api.post("/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = res.data?.data;

          if (user?.token) {
            return {
              id: user.id,
              token: user.token,
              roles: user.roles ?? [],
            };
          }

          return null;
        } catch (error: any) {
          console.error(
            "🔥 Login error:",
            error.response?.data || error.message
          );
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return "/";
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user?.token) {
        token.token = user.token;
        token.roles = user.roles ?? [];
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        token: token.token,
        roles: token.roles,
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Set session expiration time (30 days in seconds)
    updateAge: 24 * 60 * 60, // Refresh session every 24 hours
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax", // Keep 'lax' for better compatibility
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    // Important: Also configure the CSRF token cookie
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-authjs.csrf-token"
          : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is set!
  pages: {
    signIn: "/login",
  },
};
