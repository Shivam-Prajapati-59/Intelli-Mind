import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./utils/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_lxLvQ43gKCMe@ep-summer-lab-a1r46vmd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});
