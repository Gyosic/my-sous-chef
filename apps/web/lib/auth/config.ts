import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";
import { SignJWT } from "jose";
import Google from "next-auth/providers/google";
import Naver from "next-auth/providers/naver";
import { accounts, users } from "@repo/db";
import { db } from "@/lib/db";

export type NextAuthPageSearchParams = Promise<{ callbackUrl?: string }>;

export interface Credentials {
  email: string;
  password: string;
}

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

const authConfig: NextAuthConfig = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  providers: [Google({}), Naver({})],
  pages: {
    signIn: "/",
    signOut: "/signout",
    error: "/error",
  },
  callbacks: {
    jwt: async ({ token }) => {
      return token;
    },
    session: async ({ session, token }) => {
      const access_token = await new SignJWT({
        sub: token.sub,
        id: token.id,
        email: token.email,
        name: token.name,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secret);

      return Object.assign(session, { access_token });
    },
    signIn: async ({ user }): Promise<boolean> => Boolean(user.id),
    authorized: async ({ auth }): Promise<boolean> => Boolean(auth),
  },
  secret: process.env.AUTH_SECRET,
};

export default authConfig;
