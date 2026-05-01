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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let posts: HistoryRow[] = [];
  let loadError: string | null = null;

  if (user) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      if (!isMissingPostsTableError(error.message)) {
        loadError = error.message;
      }
    } else {
      posts = Array.isArray(data) ? (data as HistoryRow[]) : [];
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-200">
          History
        </h1>
        <p className="mt-2 text-slate-400">
          View your past generated content
        </p>
      </div>

      <Card className="border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-200">
            Post History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="py-12 text-center text-slate-400">
              <p>Sign in to see your generated content history.</p>
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
                <div key={String(post.id)} className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
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
                  <p className="whitespace-pre-wrap text-sm text-slate-200">
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

