import { items } from './seed-data';
import { db } from "./db/drizzle";
import { sql } from 'drizzle-orm';
import {
    Item,
} from "./db/schema/items";

export async function seedItems() {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await db.execute(sql`TRUNCATE TABLE items CASCADE`);
    await db.insert(Item).values(items).onConflictDoNothing();
}