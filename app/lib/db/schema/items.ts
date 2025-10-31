import { uuid, text, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod"

export const Item = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("text").notNull(),
  item_id: text("item_id").notNull(),
});

export type SelectItem = typeof Item.$inferSelect;

export const SelectItemSchema = createSelectSchema(Item).omit({id: true});