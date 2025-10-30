import { fetchAllItems } from "@/app/lib/data";

export default async function Page() {
    const items = await fetchAllItems();

    return items.map((item) => (
        <div key={item.id} className="mb-4 p-4 border rounded">
            <h2 className="text-xl font-bold mb-2">{item.name}</h2>
            <p>{item.item_id}</p>
        </div>
    ));
}