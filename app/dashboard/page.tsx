import AnalyticsCards from "@/components/dashboard/analytics-cards";
import ConsistencyHeatmap from "@/components/dashboard/consistency-heatmap";
import ContentStudio from "@/components/dashboard/content-studio";
import { createClient } from "@/lib/supabase/server";

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
    // Use server-side Supabase client to fetch posts for current user
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Default values when no user or table exists
    let streak = 0;
    let totalPosts = 0;
    let consistencyScore = 0;
    let contributionData: ContributionPoint[] = [];

    if (user) {
        // Try to read `posts` table. If the table doesn't exist, handle gracefully.
        try {
            const { data, error } = await supabase
                .from("posts")
                .select("id, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                // Table might not exist yet; fall back to empty dataset.
                if (!isMissingPostsTableError(error.message)) {
                    console.warn("Supabase query error for posts:", error.message);
                }
            }

            const posts = Array.isArray(data) ? data : [];
            totalPosts = posts.length;

            // Build a date -> count map for last 365 days
            const map = buildEmptyContributionMap(365);
            posts.forEach((p: any) => {
                if (!p?.created_at) return;
                const d = new Date(p.created_at);
                const key = d.toISOString().split("T")[0];
                if (map[key] === undefined) return;
                map[key] = (map[key] || 0) + 1;
            });

            contributionData = Object.keys(map).map((date) => ({
                date,
                count: map[date],
            }));

            // Compute current streak (consecutive days up to today with at least 1 post)
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

            // Consistency score: percent of days active in last 30 days
            const last30Keys = Object.keys(map).slice(-30);
            const active30 = last30Keys.reduce((acc, k) => acc + (map[k] > 0 ? 1 : 0), 0);
            consistencyScore = Math.round((active30 / Math.max(1, last30Keys.length)) * 100);
        } catch (err) {
            console.warn("Error computing dashboard analytics:", err);
        }
    }

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-200">
                    Dashboard
                </h1>
                <p className="mt-2 text-slate-400">Track your consistency and generate content</p>
            </div>

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
