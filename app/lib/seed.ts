import bcrypt from 'bcrypt';
import { items, users } from './seed-data';
import { db } from "./db/drizzle";
import { sql } from 'drizzle-orm';
import { Item } from "./db/schema/items";
import { User } from "./db/schema/users";

export async function seedItems() {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await db.execute(sql`TRUNCATE TABLE items CASCADE`);
    await db.insert(Item).values(items).onConflictDoNothing();
}

export async function seedUsers() {
    await db.execute(sql`TRUNCATE TABLE users CASCADE`);

    users.forEach(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await db.insert(User).values({
            ...user,
            password: hashedPassword,
        }).onConflictDoNothing();
    });
}