import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        userEmail={user.email || undefined}
        userAvatar={user.user_metadata?.avatar_url}
      />
      <main className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="flex h-14 items-center px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-slate-500">
              <span className="font-medium text-slate-900">Dashboard</span>
              <span className="mx-2 text-slate-300">/</span>
              <span>Generator</span>
            </nav>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

