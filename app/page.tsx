"use client";

import { Tractor, Hammer } from "lucide-react"
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Home() {
    return (
        <main className="flex items-center justify-around">
            <Link className="w-full max-w-md mr-2" href="/builds">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Hammer className="mr-4" />
                            <span>
                                Builds
                            </span>
                        </CardTitle>
                        <CardDescription>
                            Click here to view in-progress builds and build ideas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        Builds
                    </CardContent>
                </Card>
            </Link>
            <Link className="w-full max-w-md mr-2" href="/farms">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Tractor className="mr-4" />
                            <span>
                                Farms
                            </span>
                        </CardTitle>
                        <CardDescription>
                            Click here to view the list of farms, or add new ones
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        Farms
                    </CardContent>
                </Card>
            </Link>
        </main>
    );
}
