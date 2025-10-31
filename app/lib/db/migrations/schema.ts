import { pgTable, uuid, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const items = pgTable("items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	text: text().notNull(),
	itemId: text("item_id").notNull(),
});
