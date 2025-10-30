import { seedItems } from '@/app/lib/seed';

export default async function Page() {
    let seedMessage = "Data seeding complete";
    try {
        await seedItems();
        return <p className="text-green-500">
            Data Seeding Complete
        </p>;
    } catch (error) {
        console.error("Error during data seeding:", error);
        return <p className="text-red-500">
            Data Seeding Failed
        </p>;
    }
}