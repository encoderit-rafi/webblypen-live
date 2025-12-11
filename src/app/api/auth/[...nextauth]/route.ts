import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth";

// ✅ Export GET and POST as route handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
