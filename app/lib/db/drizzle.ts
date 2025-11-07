import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: ".env" });

// as per Supabase Drizzle docs, prepared statements are not supported in "Transaction" pool mode
const client = postgres(process.env.POSTGRES_URL!, { prepare: false });
export const db = drizzle(client);