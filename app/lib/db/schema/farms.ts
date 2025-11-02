import { uuid, integer, text, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { FarmCategory } from "./farm-categories";
import { Item } from "./items";

export const FarmAutomationLevel = pgEnum("automation_level", ["Automatic", "Semi-Automatic", "Manual"])

export const Farm = pgTable("Farms", {
    id: uuid("id").primaryKey().defaultRandom(),
    farm_category_id: uuid("farm_category_id").references(() => FarmCategory.id).notNull(),
    time_to_build_mins: integer("time_to_build_mins").notNull(),
    automation_level: FarmAutomationLevel().notNull(),
    reference_url: text(),
}).enableRLS();

export type SelectFarm = typeof Farm.$inferSelect;

export const FarmDrops = pgTable("FarmDrops", {
    farm_id: uuid().references(() => Farm.id).notNull(),
    item_id: uuid().references(() => Item.id).notNull(),
    quantity_per_hour: integer().notNull(),
}).enableRLS();