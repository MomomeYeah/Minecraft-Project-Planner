import { uuid, integer, text, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod"
import { Item } from "./items";

export const Build = pgTable("Builds", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text().notNull(),
    description: text().notNull(),
}).enableRLS();

export type SelectBuild = typeof Build.$inferSelect;

export const SelectBuildSchema = createSelectSchema(Build, {
    name: (schema) => schema.min(1, {message: "Must be between 1 and 100 characters"}).max(100, {message: "Must be between 1 and 100 characters"}),
    description: (schema) => schema.min(1, {message: "Must be between 1 and 255 characters"}).max(255, {message: "Must be between 1 and 100 characters"}),
}).omit({id: true});

export const BuildRequirements = pgTable("BuildRequirements", {
    build_id: uuid().references(() => Build.id).notNull(),
    item_id: uuid().references(() => Item.id).notNull(),
    quantity: integer().notNull(),
}).enableRLS();