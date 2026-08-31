import AnalyticsCards from "@/components/dashboard/analytics-cards";
import ConsistencyHeatmap from "@/components/dashboard/consistency-heatmap";
import ContentStudio from "@/components/dashboard/content-studio";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic";

type ContributionPoint = {
    date: string;
    count: number;
};

function isMissingPostsTableError(message: string) {
    return message.includes("Could not find the table 'public.posts' in the schema cache");
}

function buildEmptyContributionMap(days = 365) {
    const map: Record<string, number> = {};
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        map[d.toISOString().split("T")[0]] = 0;
    }
    return map;
}

import { redirect } from "next/navigation";

export default async function DashboardPage() {
    // Default values when no user or table exists
    let streak = 0;
    let totalPosts = 0;
    let consistencyScore = 0;
    let contributionData: ContributionPoint[] = [];
    let errorState: string | null = null;

    try {
        // Initialize client and fetch user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // If auth fails or no user session exists, redirect to login immediately.
        // In Next.js App Router, redirect() throws a special error that is caught by the framework
        // to perform the redirect, so it should be called directly in the component flow.
        if (authError || !user) {
            redirect("/login");
        }

        // Attempt to fetch user analytics
        try {
            const { data, error } = await supabase
                .from("posts")
                .select("id, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                // Handle cases where the table might not exist yet (first-time users)
                if (isMissingPostsTableError(error.message)) {
                    console.warn("Posts table not found, defaulting to empty state.");
                } else {
                    // Throw error to be caught by the inner catch block (partial failure)
                    // This allows the rest of the dashboard to load even if analytics fail
                    throw new Error(`Database error: ${error.message}`);
                }
            }

            const posts = Array.isArray(data) ? data : [];
            totalPosts = posts.length;

            const map = buildEmptyContributionMap(365);
            posts.forEach((p: any) => {
                if (!p?.created_at) return;
                const d = new Date(p.created_at);
                const key = d.toISOString().split("T")[0];
                if (map[key] !== undefined) {
                    map[key] = (map[key] || 0) + 1;
                }
            });

            contributionData = Object.keys(map).map((date) => ({
                date,
                count: map[date],
            }));

            const today = new Date();
            let current = 0;
            for (let i = 0; i < 365; i++) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const key = d.toISOString().split("T")[0];
                if ((map[key] || 0) > 0) {
                    current += 1;
                } else {
                    break;
                }
            }
            streak = current;

            const last30Keys = Object.keys(map).slice(-30);
            const active30 = last30Keys.reduce((acc, k) => acc + (map[k] > 0 ? 1 : 0), 0);
            consistencyScore = Math.round((active30 / Math.max(1, last30Keys.length)) * 100);
        } catch (dbErr) {
            // This catches db_connection_drop, db_timeout, and 500s from the Supabase layer.
            // We catch it here so the rest of the page (ContentStudio) can still render.
            console.error("Analytics fetch error:", dbErr);
            errorState = "We couldn't load your activity data right now. Your content studio is still available.";
        }
    } catch (criticalErr) {
        // If it's a Next.js redirect, re-throw it so the framework can handle it.
        // Otherwise, handle it as a fatal dashboard error.
        if ((criticalErr as any).digest?.startsWith('NEXT_REDIRECT')) {
            throw criticalErr;
        }
        console.error("Critical Dashboard Initialization Error:", criticalErr);
        errorState = "An unexpected error occurred while loading your dashboard.";
    }

    return (
        <div className="mx-auto w-full min-w-0 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Dashboard
                </h1>
                <p className="mt-2 text-slate-600">Track your consistency and generate content</p>
            </div>

            {errorState && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {errorState}
                </div>
            )}

            <div className="mb-8">
                <AnalyticsCards streak={streak} totalPosts={totalPosts} consistencyScore={consistencyScore} />
            </div>

            <div className="mb-8">
                <ConsistencyHeatmap data={contributionData} />
            </div>

            <ContentStudio />
        </div>
    );
}