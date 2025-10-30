import { Suspense } from "react";
import Search from "@/app/ui/search";
import { fetchAllItems, fetchAllItemsPages } from "@/app/lib/data";
import { SearchPagination } from "../ui/pagination";
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function PageSkeleton() {
    const iterator = Array.from({ length: 10 }, (_, i) => i);

    return (
        <TableBody>
            {iterator.map((index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium"><Skeleton className="h-6 w-1/2 mb-2" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-1/2 mb-2 float-right" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

async function PageData(props: PageProps) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;

    const items = await fetchAllItems(query, currentPage);

    return (
        <TableBody>
            {items.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.item_id}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

async function PagePagination(props: PageProps) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const query = searchParams?.query || "";
    const totalPages = await fetchAllItemsPages(query);

    return (
        <SearchPagination currentPage={currentPage} totalPages={totalPages} />
    );
}

type PageProps = {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>
}
export default async function Page(props: PageProps) {
    return (
        <>
            <Search placeholder="Search items..." />
            <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Item ID</TableHead>
                    </TableRow>
                </TableHeader>
                <Suspense fallback={<PageSkeleton />}>
                    <PageData searchParams={props.searchParams} />
                </Suspense>
            </Table>
            <div className="mt-5 flex w-full justify-center">
                <Suspense fallback={null}>
                    <PagePagination searchParams={props.searchParams} />
                </Suspense>
            </div>
        </>
    );
}