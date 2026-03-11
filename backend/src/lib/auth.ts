import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { prisma } from "../lib/db.js";
import { env } from "../env/index.js";

const isProd = env.NODE_ENV === "prod";

const googleProvider =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          prompt: "select_account" as const,
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined;

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  advanced: isProd
    ? {
        crossSubDomainCookies: {
          enabled: true,
          domain: ".vercel.app",
        },
        cookies: {
          session_token: {
            attributes: {
              sameSite: "none",
              secure: true,
            },
          },
        },
      }
    : {
        cookies: {
          session_token: {
            attributes: {
              sameSite: "lax",
              secure: false,
            },
          },
        },
      },
  trustedOrigins: [
    "http://localhost:3000",
    "https://gerenciador-de-atividades-fisicas-f.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
  },

  ...(googleProvider ? { socialProviders: googleProvider } : {}),

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [openAPI()],
});
