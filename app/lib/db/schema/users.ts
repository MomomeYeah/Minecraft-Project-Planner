import { uuid, text, pgTable } from "drizzle-orm/pg-core";

export const User = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
});

export type SelectUser = typeof User.$inferSelect;