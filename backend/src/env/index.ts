import "dotenv/config";
import { z } from "zod";

const DEFAULT_DATABASE_URL =
  "postgresql://postgres:password@localhost:5433/treinos-api";

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length === 0 ? undefined : trimmedValue;
};

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "prod"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().default(DEFAULT_DATABASE_URL),
  ),
  GOOGLE_CLIENT_ID: z.preprocess(emptyStringToUndefined, z.string().optional()),
  GOOGLE_CLIENT_SECRET: z.preprocess(
    emptyStringToUndefined,
    z.string().optional(),
  ),
  BETTER_AUTH_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().default("http://localhost:3333"),
  ),
  GEMINI_API_KEY: z.preprocess(emptyStringToUndefined, z.string().optional()),
  GEMINI_MODEL: z.preprocess(
    emptyStringToUndefined,
    z.string().default("gemini-2.0-flash"),
  ),
});

export const _env = envSchema.safeParse(process.env); // tenta validar para ver se tem as informações acima

if (_env.success === false) {
  console.error("❌ Invalid environment variables", z.treeifyError(_env.error));
  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
