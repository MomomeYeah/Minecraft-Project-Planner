import { uuid, text, pgTable } from "drizzle-orm/pg-core";

export const Item = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("text").notNull(),
  item_id: text("item_id").notNull(),
});

export type SelectItem = typeof Item.$inferSelect;