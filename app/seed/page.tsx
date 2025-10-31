import { seedItems } from '@/app/lib/seed';

export default async function Page() {
    const successMessage = <p className="text-green-500">
            Data Seeding Complete
        </p>;
    const failureMessage = <p className="text-red-500">
            Data Seeding Failed
        </p>;

    try {
        await seedItems();
        return successMessage; 
    } catch (error) {
        console.error("Error during data seeding:", error);
        return failureMessage;
    }
}