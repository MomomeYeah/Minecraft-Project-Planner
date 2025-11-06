import { uuid, integer, text, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod"
import { FarmCategory } from "./farm-categories";
import { Item, ItemQuantityType } from "./items";
import { z } from 'zod';

/** Table definition for a farm requirements - one-to-many between Farns and Items, with associated quantities */
export const FarmRequirements = pgTable("FarmRequirements", {
    farm_id: uuid().references(() => Farm.id).notNull(),
    item_id: uuid().references(() => Item.id).notNull(),
    quantity: integer().notNull(),
    quantity_type: ItemQuantityType().notNull(),
}).enableRLS();

/** Inferred type definition for farm requirements for use as SELECT statement return values */
export type SelectFarmRequirements = typeof FarmRequirements.$inferSelect & { "item_name": typeof Item.$inferSelect.name };

/** Validation schema for farm requirements */
export const SelectFarmRequirementsSchema = createSelectSchema(FarmRequirements, {
    quantity: () => z.coerce.number({message: "Must be a number"}).gt(0, {message: "Must be greater than zero"}),
});

/** Table definition for a farm requirements - one-to-many between Farns and Items, with associated quantities */
export const FarmOutputs = pgTable("FarmOutputs", {
    farm_id: uuid().references(() => Farm.id).notNull(),
    item_id: uuid().references(() => Item.id).notNull(),
    quantity: integer().notNull(),
    quantity_type: ItemQuantityType().notNull(),
}).enableRLS();

/** Inferred type definition for farm requirements for use as SELECT statement return values */
export type SelectFarmOutputs = typeof FarmOutputs.$inferSelect & { "item_name": typeof Item.$inferSelect.name };

/** Validation schema for farm outputs */
export const SelectFarmOutputsSchema = createSelectSchema(FarmOutputs, {
    quantity: () => z.coerce.number({message: "Must be a number"}).gt(0, {message: "Must be greater than zero"}),
});

export const FarmAutomationLevel = pgEnum("automation_level", ["Automatic", "Semi-Automatic", "Manual"])

export const Farm = pgTable("Farms", {
    id: uuid("id").primaryKey().defaultRandom(),
    farm_category_id: uuid("farm_category_id").references(() => FarmCategory.id).notNull(),
    name: text().notNull(),
    time_to_build_mins: integer("time_to_build_mins").notNull(),
    automation_level: FarmAutomationLevel().notNull(),
    reference_url: text(),
}).enableRLS();

export type SelectFarm = typeof Farm.$inferSelect & {
    "requirements"?: Array<SelectFarmRequirements>
    "outputs"?: Array<SelectFarmOutputs>
};

export const SelectFarmSchema = createSelectSchema(Farm, {
    name: (schema) => schema.min(1, {message: "Must be between 1 and 100 characters"}).max(100, {message: "Must be between 1 and 100 characters"}),
    time_to_build_mins: () => z.coerce.number({message: "Must be a number"}).gt(0, {message: "Must be greater than zero"}),
    reference_url: () => z.url().or(z.literal(""))
}).omit({id: true}).extend({
    requirements: z.array(SelectFarmRequirementsSchema.omit({farm_id: true})),
    outputs: z.array(SelectFarmOutputsSchema.omit({farm_id: true}))
});