import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/about", "/contact", "/privacy"];

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  console.log("Current path:", pathname);
  console.log("Token found:", !!token);

  // cek apakah token ada dan token apakah sudah expired
  if (token && isTokenExpired(token)) {
    console.log("Token is expired. Deleting cookie and redirecting to /login.");
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    return response;
  }

  // cek apakah path publik dan token ada
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // cek apakah token ada dan bukan path publik
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// cek token apakah expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const { exp } = JSON.parse(decodedPayload);

    console.log("Token Expiration Time (exp):", new Date(exp * 1000));
    console.log("Current Time:", new Date());

    if (!exp) {
      console.log("Token does not have an 'exp' property.");
      return true;
    }

    const expiryDate = new Date(exp * 1000);
    const isExpired = expiryDate.getTime() < Date.now();
    console.log("Is token expired?", isExpired);
    return isExpired;
  } catch (error) {
    console.error(
      "Error parsing token. Token will be considered invalid.",
      error
    );
    return true;
  }
};
