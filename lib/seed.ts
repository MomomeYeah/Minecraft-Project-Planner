import bcrypt from 'bcrypt';
import { eq, sql } from 'drizzle-orm';
import { farm_categories, farms, items, users } from './seed-data';
import { db } from "../app/lib/db/drizzle";
import { FarmCategory } from "../app/lib/db/schema/farm-categories";
import { Farm, FarmDrops, FarmAutomationLevel } from "../app/lib/db/schema/farms";
import { Item } from "../app/lib/db/schema/items";
import { User } from "../app/lib/db/schema/users";

async function dropDatabase() {
    await db.execute(sql`DROP TABLE IF EXISTS ${FarmCategory} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${Farm} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${FarmDrops} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${Item} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${User} CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS ${FarmAutomationLevel}`);
}

async function seedFarmCategories() {
    await db.execute(sql`TRUNCATE TABLE ${FarmCategory} CASCADE`);
    await db.insert(FarmCategory).values(farm_categories).onConflictDoNothing();
}

async function seedFarms() {
    await db.execute(sql`TRUNCATE TABLE ${Farm} CASCADE`);

    if (farms.length === 0) {
        return;
    }

    for (let i = 0; i < farms.length; i++) {
        const farm = farms[i];
        const farmCategory = await db.select().from(FarmCategory).where(eq(FarmCategory.category_name, farm.category));
        if (farmCategory.length === 0) {
            continue;
        }
        const farmCategoryId: string = farmCategory[0].id;

        // automation_level is an enum, and `values` here isn't happy unless I pass values here directly
        // as opposed to getting them from `farm`
        await db.insert(Farm).values({
            farm_category_id: farmCategoryId,
            time_to_build_mins: farm.time_to_build_mins,
            automation_level: "Automatic",
            reference_url: farm.reference_url,
        }).onConflictDoNothing();
    }
}

async function seedItems() {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await db.execute(sql`TRUNCATE TABLE ${Item} CASCADE`);
    await db.insert(Item).values(items).onConflictDoNothing();
}

async function seedUsers() {
    await db.execute(sql`TRUNCATE TABLE ${User} CASCADE`);

    if (users.length === 0) {
        return;
    }

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await db.insert(User).values({
            ...user,
            password: hashedPassword,
        }).onConflictDoNothing();
    }
}

try {
    // await dropDatabase();
    // console.log("All tables dropped");

    await seedFarmCategories();
    console.log("Farm categories seeded successfully.");
    await seedFarms();
    console.log("Farms seeded successfully.");
    await seedItems();
    console.log("Items seeded successfully.");
    await seedUsers();
    console.log("Users seeded successfully.");

    await db.$client.end();
} catch (error) {
    console.log(error);
}