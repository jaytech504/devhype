import AnalyticsCards from "@/components/dashboard/analytics-cards";
import ConsistencyHeatmap from "@/components/dashboard/consistency-heatmap";
import ContentStudio from "@/components/dashboard/content-studio";

// Generate mock contribution data for the last 365 days
function generateMockContributionData() {
    const data = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        // Random activity: 70% chance of no activity, 20% chance of 1 post, 8% chance of 2 posts, 2% chance of 3+ posts
        const rand = Math.random();
        let count = 0;
        if (rand > 0.3) {
            count = 0;
        } else if (rand > 0.1) {
            count = 1;
        } else if (rand > 0.02) {
            count = 2;
        } else {
            count = Math.floor(Math.random() * 3) + 3; // 3-5 posts
        }

        data.push({
            date: dateStr,
            count,
        });
    }

    return data;
}

export default async function DashboardPage() {
    // Mock analytics data
    const mockAnalytics = {
        streak: 4,
        totalPosts: 12,
        consistencyScore: 85,
    };

    const mockContributionData = generateMockContributionData();

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-200">
                    Dashboard
                </h1>
                <p className="mt-2 text-slate-400">
                    Track your consistency and generate content
                </p>
            </div>

            {/* Analytics Cards */}
            <div className="mb-8">
                <AnalyticsCards
                    streak={mockAnalytics.streak}
                    totalPosts={mockAnalytics.totalPosts}
                    consistencyScore={mockAnalytics.consistencyScore}
                />
            </div>

            {/* Consistency Heatmap */}
            <div className="mb-8">
                <ConsistencyHeatmap data={mockContributionData} />
            </div>

            {/* Content Studio */}
            <ContentStudio />
        </div>
    );
}
