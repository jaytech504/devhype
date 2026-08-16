import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type HistoryRow = {
  id: string | number;
  created_at: string | null;
  content?: string | null;
  platform?: string | null;
  style?: string | null;
  repo_name?: string | null;
  commit_count?: number | null;
};

function isMissingPostsTableError(message: string) {
  return message.includes("Could not find the table 'public.posts' in the schema cache");
}

function formatTimestamp(value: string | null) {
  if (!value) return "Unknown time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const FETCH_TIMEOUT_MS = 10000;

  let user: any = null;
  let posts: HistoryRow[] = [];
  let loadError: string | null = null;

  try {
    // 1. Handle Authentication with Timeout
    const authResult = await Promise.race([
      supabase.auth.getUser(),
      new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error("AUTH_TIMEOUT")), FETCH_TIMEOUT_MS)
      ),
    ]);

    const { data: { user: authUser }, error: authError } = authResult;

    if (authError) {
      throw new Error("AUTH_FAILED");
    }
    user = authUser;

    if (user) {
      // 2. Handle Database Fetching with strict Timeout
      const dbResult = await Promise.race([
        supabase
          .from("posts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100),
        new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error("DB_TIMEOUT")), FETCH_TIMEOUT_MS)
        ),
      ]);

      const { data, error: dbError } = dbResult;

      if (dbError) {
        console.error("[HistoryPage DB Error]:", dbError.message);
        if (isMissingPostsTableError(dbError.message)) {
          loadError = null;
        } else {
          // Mask technical details to prevent leaking internal DB state
          loadError = "We encountered an issue retrieving your history. Please try again later.";
        }
      } else {
        posts = Array.isArray(data) ? (data as HistoryRow[]) : [];
      }
    }
  } catch (err: any) {
    console.error("[HistoryPage Fatal Error]:", err);

    // Map specific error types to user-friendly, non-leaking messages
    if (err.message === "AUTH_TIMEOUT" || err.message === "DB_TIMEOUT") {
      loadError = "The request took too long to respond. Please check your connection and try again.";
    } else if (err.message === "AUTH_FAILED") {
      loadError = "We couldn't verify your identity. Please sign in again.";
    } else {
      loadError = "An unexpected error occurred while loading the dashboard.";
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-700 font-bold tracking-tight ">
          History
        </h1>
        <p className="mt-2 text-slate-400">
          View your past content
        </p>
      </div>

      <Card className="border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700 font-semibold ">
            Post History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="py-12 text-center text-slate-400">
              <p>Sign in to see your history.</p>
            </div>
          ) : loadError ? (
            <div className="py-12 text-center text-slate-400">
              <p>Unable to load history right now.</p>
              <p className="mt-2 text-xs text-slate-500">{loadError}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p>No posts yet. Start generating content to see your history here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={String(post.id)} className="rounded-lg border border-slate-800 bg-gray-200 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>{formatTimestamp(post.created_at)}</span>
                    {post.platform ? (
                      <span className="rounded bg-slate-800 px-2 py-0.5 uppercase tracking-wide">{post.platform}</span>
                    ) : null}
                    {post.style ? (
                      <span className="rounded bg-slate-800 px-2 py-0.5 capitalize">{post.style}</span>
                    ) : null}
                    {post.repo_name ? (
                      <span className="rounded bg-slate-800 px-2 py-0.5">{post.repo_name}</span>
                    ) : null}
                    {typeof post.commit_count === "number" ? (
                      <span className="rounded bg-slate-800 px-2 py-0.5">{post.commit_count} commits</span>
                    ) : null}
                  </div>
                  <p className="whitespace-pre-wrap text-gray-700 text-sm ">
                    {post.content?.trim() || "Generated post entry"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}