import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-md">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Welcome to DevHype
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Sign in to get started with your GitHub integration
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

