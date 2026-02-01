"use client";

import { useState } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        try {
            setLoading(true);
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "github",
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error("Error signing in:", error);
                alert("Failed to sign in. Please try again.");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleSignIn}
            disabled={loading}
            size="lg"
            className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-purple-500/50 transition-all hover:scale-105 hover:shadow-purple-500/70 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                <Github className="h-5 w-5" />
                {loading ? "Signing in..." : "Sign in with GitHub"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </Button>
    );
}

