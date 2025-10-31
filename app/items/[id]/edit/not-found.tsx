import Link from 'next/link';
import { Frown } from "lucide-react"
import { Button } from '@/components/ui/button';
 
export default function NotFound() {

    // This template overrides the default 404 page for this route
    return (
        <main className="flex h-full flex-col items-center justify-center gap-2">
            <Frown className="w-10" />
            <h2 className="text-xl font-semibold">404 Not Found</h2>
            <p>Could not find the requested invoice.</p>
            <Button className="mt-4" variant="outline">
                <Link href="/items">
                    Go Back
                </Link>
            </Button>
        </main>
    );
}