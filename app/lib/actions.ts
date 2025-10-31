"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/db/drizzle";
import { Item, SelectItemSchema } from "@/app/lib/db/schema/items";

export async function createItem(formData: FormData) {
    const { name, item_id } = SelectItemSchema.parse({
        name: formData.get("item-name"),
        item_id: formData.get("item-id"),
    });

    await db.insert(Item).values({
        name,
        item_id,
    });
 
    revalidatePath('/items');
    redirect('/items');
}

export async function updateItem(id: string, formData: FormData) {
    const { name, item_id } = SelectItemSchema.parse({
        name: formData.get("item-name"),
        item_id: formData.get("item-id"),
    });

    await db
        .update(Item)
        .set({
            name,
            item_id,
        })
        .where(eq(Item.id, id));
 
    revalidatePath('/items');
    redirect('/items');
}

export async function deleteItem(id: string) {
    await db
        .delete(Item)
        .where(eq(Item.id, id));
 
    revalidatePath('/items');
}