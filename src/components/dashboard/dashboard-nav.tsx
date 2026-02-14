
"use client";

import { Button } from "@/components/ui/button";
import { useDashboard } from "@/app/dashboard/dashboard-provider";
import { LayoutDashboard, BarChart, Settings, MessageSquare, Camera, PenSquare, HelpCircle, ChevronDown } from "lucide-react";
import type { DashboardTab } from "@/app/dashboard/dashboard-provider";
import { ScrollArea } from "../ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";


const navItems: { name: string; tab: DashboardTab; icon: React.ElementType }[] = [
    { name: "Overview", tab: "overview", icon: LayoutDashboard },
    { name: "Reviews", tab: "reviews", icon: MessageSquare },
    { name: "Performance", tab: "performance", icon: BarChart },
    { name: "Posts", tab: "posts", icon: PenSquare },
    { name: "Photos & Media", tab: 'media', icon: Camera },
    // { name: "Q&A", tab: 'qa', icon: HelpCircle }, // Disabled due to API deprecation
    { name: "Details", tab: "details", icon: Settings },
];

export default function DashboardNav() {
    const { activeTab, setActiveTab, selectedLocation, allLocationsData } = useDashboard();

    const showNav = selectedLocation && !allLocationsData;

    if (!showNav) {
        return null;
    }

    const activeItem = navItems.find(item => item.tab === activeTab);

    return (
        <nav className="border-b relative -mt-4 mb-4 sm:mt-0 sm:mb-0">
            {/* Mobile Dropdown */}
            <div className="md:hidden px-4 py-2">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                             <div className="flex items-center gap-2">
                                {activeItem && <activeItem.icon className="h-4 w-4" />}
                                <span>{activeItem?.name || 'Navigation'}</span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                         {navItems.map((item) => (
                            <DropdownMenuItem 
                                key={item.name} 
                                onClick={() => setActiveTab(item.tab)}
                                className={cn(activeTab === item.tab && 'bg-muted')}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:block">
                <ScrollArea className="w-full whitespace-nowrap">
                    <ul className="flex items-center gap-2 text-sm font-medium h-12 px-4">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Button
                                    variant="ghost"
                                    className={`h-full rounded-b-none rounded-t-md border-b-2 flex-shrink-0 ${
                                        activeTab === item.tab 
                                        ? 'border-primary bg-muted/50' 
                                        : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                    }`}
                                    onClick={() => setActiveTab(item.tab)}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.name}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </div>
        </nav>
    )
}
