"use client"

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { SelectItem } from "@/app/lib/db/schema/items";
import { fetchAllItems } from "@/app/lib/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RelatedItemFields } from "@/app/lib/actions";

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

type ItemTableProps = {
    checked: Array<RelatedItemFields>,
    handleItemToggled: (item_id: string, item_name: string, checked: boolean) => void,
}
export default function ItemTable(props: ItemTableProps) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Array<SelectItem>>([]);
    const [filteredItems, setFilteredItems] = useState<Array<SelectItem>>([]);

    useEffect(() => {
        async function getData() {
            setLoading(true);

            const fetchedData = await fetchAllItems();
            setItems(fetchedData);
            setFilteredItems(fetchedData);
            setLoading(false);
        }
        getData();
    }, []);

    const handleSearch = useDebouncedCallback((term: string) => {
        const newFilteredItems = items.filter((item) => item.name.toLowerCase().match(term.toLowerCase()));
        setFilteredItems(newFilteredItems);
    }, 300);
    
    return (
        <>
            <Field>
                <FieldLabel htmlFor="name" className="sr-only">Search</FieldLabel>
                <Input
                    id="name"
                    name="name"
                    placeholder="Search Items"
                    autoComplete="off"
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </Field>
            <ScrollArea className="h-144 pr-4">
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
                        <ItemTableData {...props} items={filteredItems} />
                    }
                </Table>
            </ScrollArea>
        </>
    )
}