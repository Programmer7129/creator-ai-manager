import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      agencyId?: string
      agencyName?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    agencyId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    agencyId?: string
    agencyName?: string
  }
} 