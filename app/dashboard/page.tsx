import AnalyticsCards from "@/components/dashboard/analytics-cards";
import ConsistencyHeatmap from "@/components/dashboard/consistency-heatmap";
import ContentStudio from "@/components/dashboard/content-studio";
import { createClient } from "@/lib/supabase/server";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"

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

        if (authError) {
            throw new Error(`Authentication failed: ${authError.message}`);
        }

        if (user) {
            // Attempt to fetch user analytics
            try {
                const { data, error } = await supabase
                    .from("posts")
                    .select("id, created_at")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (error) {
                    // If it's a missing table error, we treat it as an empty state (non-fatal)
                    // Otherwise, we treat it as a database error (fatal to analytics block)
                    if (!isMissingPostsTableError(error.message)) {
                        throw new Error(`Database error: ${error.message}`);
                    }
                    console.warn("Posts table not found, defaulting to empty state.");
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
                console.error("Analytics fetch error:", dbErr);
                errorState = "We couldn't load your activity data. Please try again later.";
            }
        }
    } catch (criticalErr) {
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

            {/* Error UI: Ensures client doesn't hang and user sees failure context */}
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

            {/* Error Banner - Addresses the 'client will hang' issue by providing visual feedback */}
            {errorState && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {errorState}
                </div>
            )}

            {/* Analytics Cards */}
            <div className="mb-8">
                <AnalyticsCards streak={streak} totalPosts={totalPosts} consistencyScore={consistencyScore} />
            </div>

            {/* Consistency Heatmap */}
            <div className="mb-8">
                <ConsistencyHeatmap data={contributionData} />
            </div>

            {/* Content Studio */}
            <ContentStudio />
        </div>
    );
}