import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
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
          <div className="text-center py-12 text-slate-400">
            <p>No posts yet. Start generating content to see your history here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

