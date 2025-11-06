import { Suspense } from 'react';
import Form from '@/app/ui/farms/create-form';
import { FormSkeleton } from '@/app/ui/farms/base-form';
import { fetchAllFarmCategories } from "@/app/lib/data";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
 
export default async function Page() {
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
                        <BreadcrumbPage>Create Farm</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Suspense fallback={<FormSkeleton />}>
                <Form farmCategoriesPromise={farmCategories} />
            </Suspense>
        </main>
    );
}