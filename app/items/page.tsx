import Search from "@/app/ui/search";
import { fetchAllItems, fetchAllItemsPages } from "@/app/lib/data";
import { SearchPagination } from "../ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type PageProps = {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>
}
export default async function Page(props: PageProps) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchAllItemsPages(query);

    const items = await fetchAllItems(query, currentPage);
    
    return (
        <>
            <Search placeholder="Search items..." />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Item ID</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.item_id}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-5 flex w-full justify-center">
                <SearchPagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </>
    );
}