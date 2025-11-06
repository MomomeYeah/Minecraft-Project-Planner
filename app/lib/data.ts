import { getTableColumns, count, eq, ilike } from "drizzle-orm";
import { db } from "@/app/lib/db/drizzle";
import {
    Item,
    SelectItem,
} from "./db/schema/items";
import {
    FarmCategory,
    SelectFarmCategory
} from "./db/schema/farm-categories";
import {
    Farm,
    SelectFarm,
    FarmRequirements,
    FarmOutputs
} from "./db/schema/farms";
import {
    Build,
    BuildRequirements,
    SelectBuild,
} from "./db/schema/builds";

const PAGE_SIZE = 20;

/** Items */

export async function fetchAllItems(query: string, currentPage: number): Promise<SelectItem[]> {
    try {
        return await db
            .select()
            .from(Item)
            .where(
                ilike(Item.name, `%${query}%`)
            ).orderBy(Item.name)
            .limit(PAGE_SIZE)
            .offset((currentPage - 1) * PAGE_SIZE);
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
}

export async function fetchAllItemsPages(query: string): Promise<number> {
    try {
        const itemsCount = await db
            .select({count: count()})
            .from(Item)
            .where(
                ilike(Item.name, `%${query}%`)
            );
        return Math.ceil(itemsCount[0].count / PAGE_SIZE);
    } catch (error) {
        console.error("Error fetching item count:", error);
        throw error;
    }
}

export async function fetchItemById(id: string): Promise<SelectItem> {
    try {
        const item = await db
            .select()
            .from(Item)
            .where(
                eq(Item.id, id)
            )
            .limit(1);

        return item[0];
    } catch (error) {
        console.error("Error fetching item by ID:", error);
        throw error;
    }
}

/** Farms */

export async function fetchAllFarmCategories(): Promise<SelectFarmCategory[]> {
    try {
        return await db
            .select()
            .from(FarmCategory)
            .orderBy(FarmCategory.category_name);
    } catch (error) {
        console.error("Error fetching farm categories:", error);
        throw error;
    }
}

type SelectFullFarm = SelectFarm & { category_name: string };
export async function fetchAllFarms(): Promise<SelectFullFarm[]> {
    try {
        return await db
            .select({
                ...getTableColumns(Farm),
                category_name: FarmCategory.category_name,
            })
            .from(Farm)
            .innerJoin(FarmCategory, eq(FarmCategory.id, Farm.farm_category_id))
            .orderBy(Farm.name);
    } catch (error) {
        console.error("Error fetching farms:", error);
        throw error;
    }
}

export async function fetchFarmById(id: string): Promise<SelectFullFarm> {
    try {
        const farmList = await db
            .select({
                ...getTableColumns(Farm),
                category_name: FarmCategory.category_name,
            })
            .from(Farm)
            .innerJoin(FarmCategory, eq(FarmCategory.id, Farm.farm_category_id))
            .where(
                eq(Farm.id, id)
            )
            .limit(1);

        const farm = farmList[0];

        const farmRequirements = await db
            .select({
                ...getTableColumns(FarmRequirements),
                item_name: Item.name,
            })
            .from(FarmRequirements)
            .innerJoin(Item, eq(Item.id, FarmRequirements.item_id))
            .where(eq(FarmRequirements.farm_id, id))
            .orderBy(Item.name);

        const farmOutputs = await db
            .select({
                ...getTableColumns(FarmOutputs),
                item_name: Item.name,
            })
            .from(FarmOutputs)
            .innerJoin(Item, eq(Item.id, FarmOutputs.item_id))
            .where(eq(FarmOutputs.farm_id, id))
            .orderBy(Item.name);

        return {
            ...farm,
            requirements: farmRequirements,
            outputs: farmOutputs,
        };
    } catch (error) {
        console.error("Error fetching farm by ID:", error);
        throw error;
    }
}

/** Builds */

export async function fetchAllBuilds(): Promise<SelectBuild[]> {
    try {
        return await db
            .select()
            .from(Build)
            .orderBy(Build.name);
    } catch (error) {
        console.error("Error fetching builds:", error);
        throw error;
    }
}

export async function fetchBuildById(id: string): Promise<SelectBuild> {
    try {
        const buildList = await db
            .select()
            .from(Build)
            .where(
                eq(Build.id, id)
            )
            .limit(1);

        const build = buildList[0];

        const buildRequirements = await db
            .select({
                ...getTableColumns(BuildRequirements),
                item_name: Item.name,
            })
            .from(BuildRequirements)
            .innerJoin(Item, eq(Item.id, BuildRequirements.item_id))
            .where(eq(BuildRequirements.build_id, id))
            .orderBy(Item.name);

        return {
            ...build,
            requirements: buildRequirements
        };
    } catch (error) {
        console.error("Error fetching build by ID:", error);
        throw error;
    }
}