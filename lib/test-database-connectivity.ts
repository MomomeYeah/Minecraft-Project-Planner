/** This is a utility script to test connectivity to the project database. Execute it via `node ...` */

import postgres from "postgres";
import { config } from 'dotenv';

config({ path: '.env' });
const sql = postgres(process.env.POSTGRES_URL!, { connect_timeout: 10 });

(async () => {
    try {
        const result = await sql`select now()`;
        console.log(result);
    } catch (err) {
        console.error(err);
    } finally {
        await sql.end();
    }
})();