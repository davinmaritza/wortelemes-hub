import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnApi = nextUrl.pathname.startsWith("/api");

      if (isOnApi && nextUrl.pathname !== "/api/auth") {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
  providers: [], // No providers needed since we're using credentials-based auth
} satisfies NextAuthConfig;
