"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

import clsx from "clsx";
import { Plus, Home, Tractor, Hammer, Cuboid } from "lucide-react"
import {
    SidebarMenuAction,
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
            title: "Builds",
            url: "/builds",
            icon: Hammer,
            addItemURL: "/builds/create",
            addItemText: "Create Build",
        },
        {
            title: "Farms",
            url: "/farms",
            icon: Tractor,
            addItemURL: "/farms/create",
            addItemText: "Create Farm",
        },
        {
            title: "Items",
            url: "/items",
            icon: Cuboid,
            addItemURL: "/items/create",
            addItemText: "Create Item",
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
                    {
                        item.addItemURL ?
                            <SidebarMenuAction asChild>
                                <Link href={item.addItemURL}>
                                    <Plus />
                                    <span className="sr-only">{item.addItemText}</span>
                                </Link>
                            </SidebarMenuAction>
                            : null
                    }
                </SidebarMenuItem>
            ))}
        </>
    );
}