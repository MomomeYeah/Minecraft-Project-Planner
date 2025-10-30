import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Loading() {
    const iterator = Array.from({ length: 10 }, (_, i) => i);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Item ID</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {iterator.map((index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium"><Skeleton className="h-6 w-1/2 mb-2" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-1/2 mb-2 float-right" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}