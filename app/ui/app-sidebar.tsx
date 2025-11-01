import NavLinks from "./nav-links";
import { LogOut } from "lucide-react"
import {
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";

export default function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Minecraft Project Planner</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <NavLinks />
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <form className="p-0" action={async () => {
                                        'use server';
                                        await signOut({ redirectTo: "/"})
                                    }}>
                                        <LogOut />
                                        <Button type="submit" variant="link" className="p-0">
                                            <span>Sign Out</span>
                                        </Button>
                                    </form>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}