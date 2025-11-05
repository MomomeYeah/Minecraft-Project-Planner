"use client"

import { useEffect, useState } from "react";
import { SelectItem } from "@/app/lib/db/schema/items";
import { fetchAllItems } from "@/app/lib/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { BuildRequirementFields } from "@/app/lib/actions";

function ItemTableSkeleton() {
    const iterator = Array.from({ length: 10 }, (_, i) => i);

    return (
        <TableBody>
            {iterator.map((index) => (
                <TableRow key={index}>
                    <TableCell className="w-8">
                        <Skeleton className="h-3 w-4 my-1 float-left" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-3 w-1/2 my-1" />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

type ItemTableDataProps = ItemTableProps & {
    items: Array<SelectItem>
}
function ItemTableData(props: ItemTableDataProps) {
    function itemChecked(item: SelectItem): boolean {
        for (let i = 0; i < props.checked.length; i++) {
            if (item.id === props.checked[i].item_id) return true;
        }

        return false;
    }

    return (
        <TableBody>
            {props.items.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="w-8">
                        <Checkbox
                            checked={itemChecked(item)}
                            onCheckedChange={(e) => props.handleItemToggled(item.id, item.name, !!e)}
                        />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

// async function ItemTablePagination(props: ItemTableProps) {
//     const searchParams = await props.searchParams;
//     const currentPage = Number(searchParams?.page) || 1;
//     const query = searchParams?.query || "";
//     const totalPages = await fetchAllItemsPages(query);

//     return (
//         <SearchPagination currentPage={currentPage} totalPages={totalPages} />
//     );
// }

type ItemTableProps = {
    checked: Array<BuildRequirementFields>,
    handleItemToggled: (item_id: string, item_name: string, checked: boolean) => void,
}
export default function ItemTable(props: ItemTableProps) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Array<SelectItem>>([]);
    useEffect(() => {
        async function getData() {
            setLoading(true);

            const fetchedData = await fetchAllItems("", 1);
            setItems(fetchedData);
            setLoading(false);
        }
        getData();
    }, []);

    return (
        <>
            <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead />
                        <TableHead>Name</TableHead>
                    </TableRow>
                </TableHeader>
                {
                    loading ?
                    <ItemTableSkeleton /> :
                    <ItemTableData {...props} items={items} />
                }

                {/* <Suspense fallback={<ItemTableSkeleton {...props} />}>
                    <ItemTableData {...props} />
                </Suspense> */}
            </Table>
            {/* <div className="mt-5 flex w-full justify-center">
                <Suspense fallback={null}>
                    <ItemTablePagination {...props} />
                </Suspense>
            </div> */}
        </>
    )
}