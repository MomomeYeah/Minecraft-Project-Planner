import { uuid, integer, text, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod"
import { FarmCategory } from "./farm-categories";
import { Item } from "./items";
import { z } from 'zod';

export const FarmAutomationLevel = pgEnum("automation_level", ["Automatic", "Semi-Automatic", "Manual"])

export const Farm = pgTable("Farms", {
    id: uuid("id").primaryKey().defaultRandom(),
    farm_category_id: uuid("farm_category_id").references(() => FarmCategory.id).notNull(),
    name: text().notNull(),
    time_to_build_mins: integer("time_to_build_mins").notNull(),
    automation_level: FarmAutomationLevel().notNull(),
    reference_url: text(),
}).enableRLS();

export type SelectFarm = typeof Farm.$inferSelect;

export const SelectFarmSchema = createSelectSchema(Farm, {
    name: (schema) => schema.min(1, {message: "Must be between 1 and 255 characters"}).max(255, {message: "Must be between 1 and 255 characters"}),
    time_to_build_mins: () => z.coerce.number({message: "Must be a number"}).gt(0, {message: "Must be greater than zero"}),
    reference_url: () => z.url().or(z.literal(""))
}).omit({id: true});

export const FarmDrops = pgTable("FarmDrops", {
    farm_id: uuid().references(() => Farm.id).notNull(),
    item_id: uuid().references(() => Item.id).notNull(),
    quantity_per_hour: integer().notNull(),
}).enableRLS();