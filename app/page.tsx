"use client";

import { ModeToggle } from "@/app/ui/mode-toggle";

export default function Home() {
    return (
        <div className="flex items-center">
            <div>
                <ModeToggle />
            </div>
            <span className="grow ml-6">
                Minecraft Project Planner
            </span>
        </div>
    );
}
