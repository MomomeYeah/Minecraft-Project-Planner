import { db } from "./db/drizzle";
import {
    Item,
    SelectItem,
} from "./db/schema/items";

export async function fetchAllItems(): Promise<SelectItem[]> {
    try {
        return db.select().from(Item);
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
}