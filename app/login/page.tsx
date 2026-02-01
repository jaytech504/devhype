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
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm shadow-lg">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome to{" "}
                            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                DevHype
                            </span>
                        </h1>
                        <p className="mt-2 text-slate-400">
                            Sign in to get started with your GitHub integration
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

