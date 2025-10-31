import { Suspense } from "react";
import { Pencil, Trash } from "lucide-react"
import Link from "next/link";
import { fetchAllItems, fetchAllItemsPages } from "@/app/lib/data";
import { deleteItem } from "@/app/lib/actions";
import { SearchPagination } from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import { Button } from "@/components/ui/button"
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
                    <TableCell className="font-medium">
                        <Skeleton className="h-6 w-1/2 mb-2" />
                    </TableCell>
                    <TableCell className="text-right">
                        <Skeleton className="h-6 w-1/2 mb-2 float-right" />
                    </TableCell>
                    <TableCell className="text-right">
                        <Skeleton className="h-6 w-1/2 mb-2 float-right" />
                    </TableCell>
                    <TableCell className="text-right">
                        <Skeleton className="h-6 w-1/2 mb-2 float-right" />
                    </TableCell>
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
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.item_id}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                            <Link href={`/items/${item.id}/edit`}><Pencil /></Link>
                        </Button>
                    </TableCell>
                    <TableCell className="text-right">
                        <form action={deleteItem.bind(null, item.id)}>
                            <Button variant="outline" size="sm"><Trash /></Button>
                        </form>
                    </TableCell>
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
export default function Page(props: PageProps) {
    return (
        <>
            <Suspense fallback={null}>
                <div className="flex items-center">
                    <Search placeholder="Search items..." />
                    <Button>
                        <Link href="/items/create">Create Item</Link>
                    </Button>
                </div>
            </Suspense>
            <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Item ID</TableHead>
                        <TableHead className="text-right" />
                        <TableHead className="text-right" />
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