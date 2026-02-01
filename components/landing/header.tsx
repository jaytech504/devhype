"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold">
                        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            DevHype
                        </span>
                    </Link>

                    {/* Login Button */}
                    <Link href="/login">
                        <Button
                            variant="outline"
                            className="border-slate-700 text-slate-200 hover:border-purple-500/50 hover:bg-slate-800"
                        >
                            Login
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

