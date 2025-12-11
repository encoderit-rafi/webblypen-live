// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    token: string;
    roles: string[];
  }

  interface Session {
    token: string;
    roles: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    token: string;
    roles: string[];
  }
}
