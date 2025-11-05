import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react"
import { deleteFarm } from "@/app/lib/actions";
import { fetchAllFarms } from "@/app/lib/data";
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

export const metadata: Metadata = {
    title: "Farms",
};

function FarmDataSkeleton() {
    const iterator = Array.from({ length: 10 }, (_, i) => i);

    return (
        <TableBody>
            {iterator.map((index) => (
                <TableRow key={index}>
                    <TableCell>
                        <Skeleton className="h-6 w-3/4 my-1" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 w-3/4 my-1" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 w-3/4 my-1" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 w-3/4 my-1" />
                    </TableCell>
                    <TableCell className="w-8">
                        <Skeleton className="h-6 w-6 my-1 float-right" />
                    </TableCell>
                    <TableCell className="w-8">
                        <Skeleton className="h-6 w-6 my-1 float-right" />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

async function FarmData() {
    const farms = await fetchAllFarms();

    return (
        <TableBody>
            {farms.map((farm) => (
                <TableRow key={farm.id}>
                    <TableCell>{farm.name}</TableCell>
                    <TableCell>{farm.category_name}</TableCell>
                    <TableCell>{farm.time_to_build_mins}</TableCell>
                    <TableCell>{farm.automation_level}</TableCell>
                    <TableCell className="text-right w-14">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/farms/${farm.id}/edit`}><Pencil /></Link>
                        </Button>
                    </TableCell>
                    <TableCell className="text-right w-14">
                        <form action={deleteFarm.bind(null, farm.id)}>
                            <Button variant="outline" size="icon" className="cursor-pointer"><Trash /></Button>
                        </form>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

export default async function Page() {
    return (
        <>
            <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Build Time (Mins)</TableHead>
                        <TableHead>Automation</TableHead>
                        <TableHead className="text-right" />
                        <TableHead className="text-right" />
                    </TableRow>
                </TableHeader>
                <Suspense fallback={<FarmDataSkeleton />}>
                    <FarmData />
                </Suspense>
            </Table>
        </>
    )
}