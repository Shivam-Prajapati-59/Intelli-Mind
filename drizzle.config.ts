import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./utils/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_TQ6vBrhgc9Cj@ep-shy-darkness-a1wok5n0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});
