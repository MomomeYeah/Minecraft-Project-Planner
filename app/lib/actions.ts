"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/db/drizzle";
import { Item, SelectItemSchema } from "@/app/lib/db/schema/items";

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';

export type State = {
  errors?: {
    name?: string[];
    item_id?: string[];
  };
  message?: string | null;
};

/** Items */

export async function createItem(prevState: State, formData: FormData) {
    const validatedFields = SelectItemSchema.safeParse({
        name: formData.get("item-name"),
        item_id: formData.get("item-id"),
    });

    if (! validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to create item.",
        }   
    }
    const { name, item_id } = validatedFields.data;

    try {
        await db.insert(Item).values({
            name,
            item_id,
        });
    } catch (error) {
        console.error("Error creating item:", error);
        throw error;
    }
    
    revalidatePath('/items');
    redirect('/items');
}

export async function updateItem(id: string, prevState: State, formData: FormData) {
    const validatedFields = SelectItemSchema.safeParse({
        name: formData.get("item-name"),
        item_id: formData.get("item-id"),
    });

    if (! validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to update item.",
        }   
    }
    const { name, item_id } = validatedFields.data;

    try {
        await db
            .update(Item)
            .set({
                name,
                item_id,
            })
            .where(eq(Item.id, id));
    } catch (error) {
        console.error("Error updating item:", error);
        throw error;
    }
    
    revalidatePath('/items');
    redirect('/items');
}

export async function deleteItem(id: string) {
    await db
        .delete(Item)
        .where(eq(Item.id, id));
 
    revalidatePath('/items');
}

/** Authentication */
export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials";
                default:
                    return "Authentication error";
            }
        }

        throw error;
    }
}