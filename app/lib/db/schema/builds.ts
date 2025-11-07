import { uuid, integer, text, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod"
import { Item, ItemQuantityType, RelatedItemSchemaAdjustments } from "./items";
import { z } from 'zod';

/** Table definition for a build requirements - one-to-many between Builds and Items, with associated quantities */
export const BuildRequirements = pgTable("BuildRequirements", {
    build_id: uuid().references(() => Build.id).notNull(),
    item_id: uuid().references(() => Item.id).notNull(),
    quantity: integer().notNull(),
    quantity_type: ItemQuantityType().notNull(),
}).enableRLS();

/** Inferred type definition for build requirements for use as SELECT statement return values */
export type SelectBuildRequirements = typeof BuildRequirements.$inferSelect & { "item_name": typeof Item.$inferSelect.name };

/** Validation schema for build requirements */
export const SelectBuildRequirementsSchema = createSelectSchema(BuildRequirements, RelatedItemSchemaAdjustments);

/** Table definition for builds */
export const Build = pgTable("Builds", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text().notNull(),
    description: text().notNull(),
}).enableRLS();

/** Inferred type definition for builds including an array of associated requirements */
export type SelectBuild = typeof Build.$inferSelect & { "requirements"?: Array<SelectBuildRequirements> };

/** Validation schema for builds, including an array of associated requirements */
export const SelectBuildSchema = createSelectSchema(Build, {
    name: (schema) => schema.min(1, {message: "Must be between 1 and 100 characters"}).max(100, {message: "Must be between 1 and 100 characters"}),
    description: (schema) => schema.min(1, {message: "Must be between 1 and 255 characters"}).max(255, {message: "Must be between 1 and 255 characters"}),
}).omit({id: true}).extend({
    requirements: z.array(SelectBuildRequirementsSchema.omit({build_id: true}))
});