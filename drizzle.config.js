import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./config/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://formifyai_owner:s3LyUd4tnKCa@ep-fancy-meadow-a1vcol0q.ap-southeast-1.aws.neon.tech/formifyai?sslmode=require',
  }
});
