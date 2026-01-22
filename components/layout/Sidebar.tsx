"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    MessageSquare,
    GitBranch,
    Lightbulb,
    Settings,
    FileText,
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Reddit Data", href: "/reddit", icon: MessageSquare },
    { name: "Clustering", href: "/clusters", icon: GitBranch },
    { name: "Scenarios", href: "/scenarios", icon: Lightbulb },
    { name: "Products", href: "/settings/products", icon: Settings },
    { name: "System Log", href: "/logs", icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#A50034] to-[#E4007C]" />
                    <div>
                        <h1 className="text-sm font-bold">Life's Good 365 AI</h1>
                        <p className="text-xs text-muted-foreground">Scenario Discovery</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-[#A50034] text-white"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t p-4">
                <p className="text-xs text-muted-foreground">
                    © 2026 LG Electronics
                </p>
            </div>
        </div>
    );
}
