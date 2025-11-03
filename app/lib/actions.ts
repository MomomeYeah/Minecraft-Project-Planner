"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/db/drizzle";
import { Item, SelectItemSchema } from "@/app/lib/db/schema/items";
import { Farm, SelectFarmSchema } from "@/app/lib/db/schema/farms";
import { Build, SelectBuildSchema } from "@/app/lib/db/schema/builds";

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';

/** Items */

export type ItemState = {
  errors?: {
    name?: string[];
    item_id?: string[];
  };
  message?: string | null;
};
export async function createItem(prevState: ItemState, formData: FormData) {
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

export async function updateItem(id: string, prevState: ItemState, formData: FormData) {
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

/** Farms */

export type FarmState = {
  errors?: {
    name?: string[];
    farm_category_id?: string[];
    time_to_build_mins?: string[];
    automation_level?: string[];
    reference_url?: string[];
  };
  message?: string | null;
};
export async function createFarm(prevState: FarmState, formData: FormData) {
    const validatedFields = SelectFarmSchema.safeParse({
        farm_category_id: formData.get("farm-category-id"),
        name: formData.get("name"),
        time_to_build_mins: formData.get("time-to-build-mins"),
        automation_level: formData.get("automation-level"),
        reference_url: formData.get("reference-url")
    });

    if (! validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to create farm.",
        }   
    }
    
    try {
        await db.insert(Farm).values(validatedFields.data);
    } catch (error) {
        console.error("Error creating farm:", error);
        throw error;
    }
    
    revalidatePath('/farms');
    redirect('/farms');
}

export async function updateFarm(id: string, prevState: FarmState, formData: FormData) {
    const validatedFields = SelectFarmSchema.safeParse({
        farm_category_id: formData.get("farm-category-id"),
        name: formData.get("name"),
        time_to_build_mins: formData.get("time-to-build-mins"),
        automation_level: formData.get("automation-level"),
        reference_url: formData.get("reference-url")
    });

    if (! validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to update farm.",
        }   
    }

    try {
        await db
            .update(Farm)
            .set(validatedFields.data)
            .where(eq(Farm.id, id));
    } catch (error) {
        console.error("Error updating farm:", error);
        throw error;
    }
    
    revalidatePath('/farms');
    redirect('/farms');
}

export async function deleteFarm(id: string) {
    await db
        .delete(Farm)
        .where(eq(Farm.id, id));
 
    revalidatePath('/items');
}

/** Builds */

export type BuildState = {
  errors?: {
    name?: string[];
    description?: string[];
  };
  message?: string | null;
};
export async function createBuild(prevState: BuildState, formData: FormData) {
    const validatedFields = SelectBuildSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
    });

    if (! validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to create build.",
        }   
    }
    
    try {
        await db.insert(Build).values(validatedFields.data);
    } catch (error) {
        console.error("Error creating build:", error);
        throw error;
    }
    
    revalidatePath('/builds');
    redirect('/builds');
}

export async function updateBuild(id: string, prevState: BuildState, formData: FormData) {
    const validatedFields = SelectBuildSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
    });

    if (! validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to update build.",
        }   
    }

    try {
        await db
            .update(Build)
            .set(validatedFields.data)
            .where(eq(Build.id, id));
    } catch (error) {
        console.error("Error updating build:", error);
        throw error;
    }
    
    revalidatePath('/builds');
    redirect('/builds');
}

export async function deleteBuild(id: string) {
    await db
        .delete(Build)
        .where(eq(Build.id, id));
 
    revalidatePath('/builds');
}