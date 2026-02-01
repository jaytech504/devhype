import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SignOutButton from "@/components/auth/sign-out-button";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-200">
          Settings
        </h1>
        <p className="mt-2 text-slate-400">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-200">
              Account
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400">Email</label>
              <p className="mt-1 text-slate-200">{user?.email}</p>
            </div>
            {user?.user_metadata?.full_name && (
              <div>
                <label className="text-sm font-medium text-slate-400">Name</label>
                <p className="mt-1 text-slate-200">{user.user_metadata.full_name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-200">
              Sign Out
            </CardTitle>
            <CardDescription className="text-slate-400">
              Sign out of your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignOutButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

