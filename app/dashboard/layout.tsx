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
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar
        userEmail={user.email || undefined}
        userAvatar={user.user_metadata?.avatar_url}
      />
      <main className="flex-1 lg:pl-64">
        <div className="p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}

