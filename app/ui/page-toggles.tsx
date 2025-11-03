"use client"

import { ModeToggle } from "@/app/ui/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function PageToggles() {
    return (
        <div className="mb-6">
            <SidebarTrigger className="mr-6" />
            <ModeToggle />
        </div>
    );
}