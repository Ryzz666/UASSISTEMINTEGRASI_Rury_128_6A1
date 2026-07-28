import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { getAdminEmails, isAdminEmail } from "@/src/lib/admin";

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID;
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET;
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "admin-local",
      name: "Admin Lokal",
      async authorize() {
        if (process.env.NODE_ENV === "production") {
          return null;
        }

        const [adminEmail] = getAdminEmails();

        if (!adminEmail) {
          return null;
        }

        return {
          id: "admin-local",
          email: adminEmail,
          name: "Admin",
        };
      },
    }),
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          scope: "openid email profile",
        },
      },
      token: "https://oauth2.googleapis.com/token",
      userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    }),
  ],
  secret: authSecret,
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      return isAdminEmail(user.email);
    },
    async jwt({ token, user }) {
      token.isAdmin = isAdminEmail(user?.email ?? token.email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
      }

      return session;
    },
  },
});
