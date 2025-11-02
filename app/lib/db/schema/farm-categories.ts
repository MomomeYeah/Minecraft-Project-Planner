import { uuid, text, pgTable } from "drizzle-orm/pg-core";

export const FarmCategory = pgTable("FarmCategories", {
    id: uuid("id").primaryKey().defaultRandom(),
    category_name: text().notNull(),
}).enableRLS();

export type SelectFarmCategory = typeof FarmCategory.$inferSelect;