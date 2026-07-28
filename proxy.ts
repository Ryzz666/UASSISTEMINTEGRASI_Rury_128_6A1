import { auth } from "@/auth";
import { isAdminEmail } from "@/src/lib/admin";
import { NextResponse } from "next/server";

export const proxy = auth((request) => {
  if (!request.auth) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (!isAdminEmail(request.auth.user?.email)) {
    return NextResponse.redirect(new URL("/login?error=AccessDenied", request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
