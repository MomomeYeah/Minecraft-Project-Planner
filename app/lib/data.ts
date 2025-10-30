import { count, ilike } from "drizzle-orm";
import { db } from "./db/drizzle";
import {
    Item,
    SelectItem,
} from "./db/schema/items";

const ITEMS_PER_PAGE = 20;
export async function fetchAllItems(query: string, currentPage: number): Promise<SelectItem[]> {
    try {
        return await db
            .select()
            .from(Item)
            .where(
                ilike(Item.name, `%${query}%`)
            ).orderBy(Item.name)
            .limit(ITEMS_PER_PAGE)
            .offset((currentPage - 1) * ITEMS_PER_PAGE);
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
        return Math.ceil(itemsCount[0].count / ITEMS_PER_PAGE);
    } catch (error) {
        console.error("Error fetching item count:", error);
        throw error;
    }
}