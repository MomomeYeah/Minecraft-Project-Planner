import { Suspense } from "react";
import { fetchBuildById } from "@/app/lib/data";
import { FormSkeleton } from '@/app/ui/builds/base-form';
import Form from '@/app/ui/builds/edit-form';
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
 
export default async function Page(props: { params: { id: string } }) {
    const params = await props.params;
    const buildId = params.id;
    const build = fetchBuildById(buildId);

    if (! build) {
        return notFound();
    }

    return (
        <main>
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/builds">Builds</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit Build</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Suspense fallback={<FormSkeleton />}>
                <Form buildPromise={build} />
            </Suspense>
        </main>
    );
}