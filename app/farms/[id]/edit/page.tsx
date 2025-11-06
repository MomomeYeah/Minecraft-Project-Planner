import { Suspense } from "react";
import { fetchFarmById, fetchAllFarmCategories } from "@/app/lib/data";
import { FormSkeleton } from '@/app/ui/farms/base-form';
import Form from '@/app/ui/farms/edit-form';
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
    const farmId = params.id;
    const farm = fetchFarmById(farmId);

    if (! farm) {
        return notFound();
    }

    const farmCategories = fetchAllFarmCategories();

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
                            <Link href="/farms">Farms</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit Farm</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Suspense fallback={<FormSkeleton />}>
                <Form farmPromise={farm} farmCategoriesPromise={farmCategories} />
            </Suspense>
        </main>
    );
}