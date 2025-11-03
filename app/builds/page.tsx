import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react"
import { deleteBuild } from "@/app/lib/actions";
import { fetchAllBuilds } from "@/app/lib/data";
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
    title: "Builds",
};

function BuildDataSkeleton() {
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

async function BuildData() {
    const builds = await fetchAllBuilds();

    return (
        <TableBody>
            {builds.map((build) => (
                <TableRow key={build.id}>
                    <TableCell>{build.name}</TableCell>
                    <TableCell className="text-right w-14">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/builds/${build.id}/edit`}><Pencil /></Link>
                        </Button>
                    </TableCell>
                    <TableCell className="text-right w-14">
                        <form action={deleteBuild.bind(null, build.id)}>
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
            <Button asChild>
                <Link href="/builds/create">Create Build</Link>
            </Button>
            <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right" />
                        <TableHead className="text-right" />
                    </TableRow>
                </TableHeader>
                <Suspense fallback={<BuildDataSkeleton />}>
                    <BuildData />
                </Suspense>
            </Table>
        </>
    )
}