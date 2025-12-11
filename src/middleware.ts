import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
  });

  const { pathname } = req.nextUrl;

  // Check if current route is login or signup
  const isAuthPage = pathname === "/login" || pathname === "/forgot-password";

  // If user is authenticated and trying to access auth pages, redirect away
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is not authenticated and on protected route, redirect to login
  if (!token && !isAuthPage) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ✅ Only these routes will be protected
export const config = {
  matcher: [
    "/", // Matches home page exactly
    "/inventory-counts/:path*",
    "/inventory-items/:path*",
    "/inventory-products/:path*",
    "/inventory-track/:path*",
    "/purchase-orders/:path*",
    "/purchase-requests/:path*",
    "/purchase-summery/:path*",
    "/material-usage/:path*",
    "/on-hand-stock/:path*",
    "/profit-loss/:path*",
    "/purchase-summary/:path*",
    "/recipe-cost/:path*",
    "/report-inventory-status/:path*",
    "/supplier-summary/:path*",
    "/transfer-branch-summary/:path*",
    "/transfer-items-track/:path*",
    "/wastage-summary/:path*",
    "/stock-transfers/:path*",
    "/transfer-summery/:path*",
    "/branches/:path*",
    "/brands/:path*",
    "/categories/:path*",
    "/convert-units/:path*",
    "/cost-centers/:path*",
    "/dashboard/:path*",
    "/expense-categories/:path*",
    "/expenses/:path*",
    "/ingredients/:path*",
    "/invoice-categories/:path*",
    "/invoices-and-payments/:path*",
    "/open-market/:path*",
    "/recipe-categories/:path*",
    "/recipes/:path*",
    "/roles/:path*",
    "/sales/:path*",
    "/suppliers/:path*",
    "/units/:path*",
    "/users/:path*",
    "/wastages/:path*",

    // "/reports/:path*",
    // "/inventory/:path*",
    // "/purchases/:path*",
    // "/stock-transfers/:path*",
    // "/wastage-summary/:path*",
  ],
};
