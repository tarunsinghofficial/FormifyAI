import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const generatedForms = pgTable("forms", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  jsonform: text("json_form").notNull(),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

// created after doing the generation feature
export const formResponses = pgTable("formResponses", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  response: text("response").notNull(),
  createdBy: varchar("createdBy").default("Anonymous"),
  createdAt: timestamp("createdAt").notNull(),
  formRef: uuid("formRef").references(() => generatedForms.id),
});
