"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

import clsx from "clsx";
import { Home, Sprout, Tractor, Hammer, Cuboid } from "lucide-react"
import {
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";

export default function NavLinks() {
    const pathname = usePathname();

    const items = [
        {
            title: "Home",
            url: "/",
            icon: Home,
        },
        {
            title: "Seed",
            url: "/seed",
            icon: Sprout,
        },
        {
            title: "Builds",
            url: "/builds",
            icon: Hammer,
        },
        {
            title: "Farms",
            url: "/farms",
            icon: Tractor,
        },
        {
            title: "Items",
            url: "/items",
            icon: Cuboid,
        },
    ];

    return (
        <>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link href={item.url} className={clsx(
                                {
                                    "font-medium text-blue-600 dark:text-blue-400": pathname === item.url
                                }
                            )}
                        >
                            <item.icon />
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </>
    );
}