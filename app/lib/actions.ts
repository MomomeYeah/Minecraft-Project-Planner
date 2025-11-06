"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/db/drizzle";
import { Item, SelectItem, SelectItemSchema } from "@/app/lib/db/schema/items";
import { Farm, FarmRequirements, FarmOutputs, SelectFarmSchema } from "@/app/lib/db/schema/farms";
import { Build, BuildRequirements, SelectBuildSchema } from "@/app/lib/db/schema/builds";

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';
import { z } from 'zod';

type ZodTreeifiedError = {
  errors: string[]; // Array of error messages at the current path
  properties?: { [key: string]: ZodTreeifiedError }; // For object schemas
  items?: ZodTreeifiedError[]; // For array schemas
};

/** Items */

export async function fetchAllItems(): Promise<SelectItem[]> {
    try {
        return await db
            .select()
            .from(Item)
            .orderBy(Item.name);
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
}

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

export type FarmItemFields = {
    farm_id?: FormDataEntryValue | null,
    item_id: FormDataEntryValue,
    item_name: FormDataEntryValue,
    quantity?: FormDataEntryValue | number | null,
    quantity_type?: FormDataEntryValue | null,
}
export type FarmFields = {
    name?: FormDataEntryValue | null;
    farm_category_id?: FormDataEntryValue | null;
    time_to_build_mins?: FormDataEntryValue | number | null;
    automation_level?: FormDataEntryValue | null;
    reference_url?: FormDataEntryValue | null;
    requirements: Array<FarmItemFields>;
    outputs: Array<FarmItemFields>;
}
export type FarmState = {
    fields: FarmFields,
    errors?: ZodTreeifiedError,
    message?: string | null;
}
export async function createFarm(prevState: FarmState, formData: FormData) {
    const requirement_item_quantities = formData.getAll("requirement_item_quantity");
    const requirement_item_names = formData.getAll("requirement_item_name");
    const requirement_item_quantity_types = formData.getAll("requirement_item_quantity_type");
    const requirements = formData.getAll("requirement_item_id").map((item_id, index) => ({
        item_id: item_id,
        item_name: requirement_item_names[index],
        quantity: requirement_item_quantities[index],
        quantity_type: requirement_item_quantity_types[index],
    }));

    const output_item_quantities = formData.getAll("output_item_quantity");
    const output_item_names = formData.getAll("output_item_name");
    const output_item_quantity_types = formData.getAll("output_item_quantity_type");
    const outputs = formData.getAll("output_item_id").map((item_id, index) => ({
        item_id: item_id,
        item_name: output_item_names[index],
        quantity: output_item_quantities[index],
        quantity_type: output_item_quantity_types[index],
    }));

    const fields = {
        farm_category_id: formData.get("farm-category-id"),
        name: formData.get("name"),
        time_to_build_mins: formData.get("time-to-build-mins"),
        automation_level: formData.get("automation-level"),
        reference_url: formData.get("reference-url"),
        requirements: requirements,
        outputs: outputs,
    }
    const validatedFields = SelectFarmSchema.safeParse(fields);

    if (! validatedFields.success) {
        return {
            fields: fields,
            errors: z.treeifyError(validatedFields.error),
            message: "Failed to create farm.",
        }   
    }
    
    try {
        await db.transaction(async (tx) => {
            const newFarm = await tx.insert(Farm).values(validatedFields.data).returning();

            for (let i = 0; i < requirements.length; i++) {
                const farmRequirement = {
                    farm_id: newFarm[0].id,
                    ...validatedFields.data.requirements[i],
                }

                await tx
                    .insert(FarmRequirements)
                    .values(farmRequirement);
            }

            for (let i = 0; i < outputs.length; i++) {
                const farmOutput = {
                    farm_id: newFarm[0].id,
                    ...validatedFields.data.outputs[i],
                }

                await tx
                    .insert(FarmOutputs)
                    .values(farmOutput);
            }
        });


        // await db.insert(Farm).values(validatedFields.data);
    } catch (error) {
        console.error("Error creating farm:", error);
        throw error;
    }
    
    revalidatePath('/farms');
    redirect('/farms');
}

export async function updateFarm(id: string, prevState: FarmState, formData: FormData) {
    const requirement_item_quantities = formData.getAll("requirement_item_quantity");
    const requirement_item_names = formData.getAll("requirement_item_name");
    const requirement_item_quantity_types = formData.getAll("requirement_item_quantity_type");
    const requirements = formData.getAll("requirement_item_id").map((item_id, index) => ({
        item_id: item_id,
        item_name: requirement_item_names[index],
        quantity: requirement_item_quantities[index],
        quantity_type: requirement_item_quantity_types[index],
    }));

    const output_item_quantities = formData.getAll("output_item_quantity");
    const output_item_names = formData.getAll("output_item_name");
    const output_item_quantity_types = formData.getAll("output_item_quantity_type");
    const outputs = formData.getAll("output_item_id").map((item_id, index) => ({
        item_id: item_id,
        item_name: output_item_names[index],
        quantity: output_item_quantities[index],
        quantity_type: output_item_quantity_types[index],
    }));

    const fields = {
        farm_category_id: formData.get("farm-category-id"),
        name: formData.get("name"),
        time_to_build_mins: formData.get("time-to-build-mins"),
        automation_level: formData.get("automation-level"),
        reference_url: formData.get("reference-url"),
        requirements: requirements,
        outputs: outputs,
    }
    const validatedFields = SelectFarmSchema.safeParse(fields);

    if (! validatedFields.success) {
        return {
            fields: fields,
            errors: z.treeifyError(validatedFields.error),
            message: "Failed to update farm.",
        }   
    }

    try {
        await db.transaction(async (tx) => {
            await tx
                .update(Farm)
                .set(validatedFields.data)
                .where(eq(Farm.id, id));

            await tx
                .delete(FarmRequirements)
                .where(eq(FarmRequirements.farm_id, id));

            for (let i = 0; i < requirements.length; i++) {
                const farmRequirement = {
                    farm_id: id,
                    ...validatedFields.data.requirements[i],
                }

                await tx
                    .insert(FarmRequirements)
                    .values(farmRequirement);
            }

            await tx
                .delete(FarmOutputs)
                .where(eq(FarmOutputs.farm_id, id));

            for (let i = 0; i < outputs.length; i++) {
                const farmOutput = {
                    farm_id: id,
                    ...validatedFields.data.outputs[i],
                }

                await tx
                    .insert(FarmOutputs)
                    .values(farmOutput);
            }
        });
    } catch (error) {
        console.error("Error updating farm:", error);
        throw error;
    }
    
    revalidatePath('/farms');
    redirect('/farms');
}

export async function deleteFarm(id: string) {
    await db.transaction(async (tx) => {
        await tx
            .delete(FarmRequirements)
            .where(eq(FarmRequirements.farm_id, id));

        await tx
            .delete(FarmOutputs)
            .where(eq(FarmOutputs.farm_id, id));

        await tx
            .delete(Farm)
            .where(eq(Farm.id, id));
    });
 
    revalidatePath('/items');
}

/** Builds */

export type BuildRequirementFields = {
    build_id?: FormDataEntryValue | null,
    item_id: FormDataEntryValue,
    item_name: FormDataEntryValue,
    quantity?: FormDataEntryValue | number | null,
    quantity_type?: FormDataEntryValue | null,
}
export type BuildFields = {
    name?: FormDataEntryValue | null;
    description?: FormDataEntryValue | null;
    requirements: Array<BuildRequirementFields>;
}
export type BuildState = {
    fields: BuildFields,
    errors?: ZodTreeifiedError,
    message?: string | null;
}
export async function createBuild(prevState: BuildState, formData: FormData) {
    const item_quantities = formData.getAll("item_quantity");
    const item_names = formData.getAll("item_name");
    const item_quantity_types = formData.getAll("item_quantity_type");
    const items = formData.getAll("item_id").map((item_id, index) => ({
        item_id: item_id,
        item_name: item_names[index],
        quantity: item_quantities[index],
        quantity_type: item_quantity_types[index],
    }));

    const fields = {
        name: formData.get("name"),
        description: formData.get("description"),
        requirements: items,
    }
    const validatedFields = SelectBuildSchema.safeParse(fields);

    if (! validatedFields.success) {
        return {
            fields: fields,
            errors: z.treeifyError(validatedFields.error),
            message: "Failed to create build.",
        }   
    }
    
    try {
        await db.transaction(async (tx) => {
            const newBuild = await tx.insert(Build).values(validatedFields.data).returning();

            for (let i = 0; i < items.length; i++) {
                const buildRequirement = {
                    build_id: newBuild[0].id,
                    ...validatedFields.data.requirements[i],
                }

                await tx
                    .insert(BuildRequirements)
                    .values(buildRequirement);
            }
        });
    } catch (error) {
        console.error("Error creating build:", error);
        throw error;
    }
    
    revalidatePath('/builds');
    redirect('/builds');
}

export async function updateBuild(id: string, prevState: BuildState, formData: FormData) {
    const item_quantities = formData.getAll("item_quantity");
    const item_names = formData.getAll("item_name");
    const item_quantity_types = formData.getAll("item_quantity_type");
    const items = formData.getAll("item_id").map((item_id, index) => ({
        item_id: item_id,
        item_name: item_names[index],
        quantity: item_quantities[index],
        quantity_type: item_quantity_types[index],
    }));

    const fields = {
        name: formData.get("name"),
        description: formData.get("description"),
        requirements: items,
    }
    const validatedFields = SelectBuildSchema.safeParse(fields);

    if (! validatedFields.success) {
        return {
            fields: fields,
            errors: z.treeifyError(validatedFields.error),
            message: "Failed to update build.",
        }   
    }

    try {
        await db.transaction(async (tx) => {
            await tx
                .update(Build)
                .set(validatedFields.data)
                .where(eq(Build.id, id));

            await tx
                .delete(BuildRequirements)
                .where(eq(BuildRequirements.build_id, id));

            for (let i = 0; i < items.length; i++) {
                const buildRequirement = {
                    build_id: id,
                    ...validatedFields.data.requirements[i],
                }

                await tx
                    .insert(BuildRequirements)
                    .values(buildRequirement);
            }
        });
    } catch (error) {
        console.error("Error updating build:", error);
        throw error;
    }
    
    revalidatePath('/builds');
    redirect('/builds');
}

export async function deleteBuild(id: string) {
    await db.transaction(async (tx) => {
        await tx
            .delete(BuildRequirements)
            .where(eq(BuildRequirements.build_id, id));

        await tx
            .delete(Build)
            .where(eq(Build.id, id));
    });

    revalidatePath('/builds');
}