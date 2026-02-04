import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  // List of protected routes
  const protectedRoutes = ["/dashboard", "/orders", "/products", "/ledger", "/schemes", "/checkout"];

  const pathname = request.nextUrl.pathname;

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get token from cookie
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify token
    const payload = await verifyToken(token);

    if (!payload) {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Clone the request and add user info to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-email", payload.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Public routes (login, register, verify-otp)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};
