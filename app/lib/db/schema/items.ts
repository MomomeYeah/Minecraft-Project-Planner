import { uuid, text, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod"
import { z } from 'zod';

export const Item = pgTable("Items", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    item_id: text("item_id").notNull(),
}).enableRLS();

export type SelectItem = typeof Item.$inferSelect;

export const SelectItemSchema = createSelectSchema(Item, {
    name: (schema) => schema.min(1, {message: "Must be between 1 and 255 characters"}).max(255, {message: "Must be between 1 and 255 characters"}),
    item_id: (schema) => schema.min(1, {message: "Must be between 1 and 255 characters"}).max(255, {message: "Must be between 1 and 255 characters"}),
}).omit({id: true});

export const ItemQuantityType = pgEnum("ItemQuantityTypes", ["Shulker Boxes", "Stacks", "Items"]);

export const RelatedItemSchemaAdjustments = {
    quantity: () => z.coerce.number({message: "Must be a number"}).gt(0, {message: "Must be greater than zero"}),
    quantity_type: () => z.enum(ItemQuantityType.enumValues, {
        message: "Invalid value selected"
    })
}