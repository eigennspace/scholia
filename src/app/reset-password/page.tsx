"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword, type ResetPasswordState } from "@/features/auth/actions/reset-password";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [state, action, pending] = useActionState<ResetPasswordState, FormData>(resetPassword, {});

  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-body text-muted">Invalid reset link. <a href="/forgot-password" className="text-primary hover:underline">Request a new one.</a></p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 bg-canvas flex-col justify-center items-center p-stack-xl">
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-stack-lg" />
          <h1 className="font-serif text-display font-bold text-ink">Scholia</h1>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-stack-xl">
        <div className="w-full max-w-sm">
          <h2 className="text-headline font-serif font-bold text-ink mb-stack-lg">Set new password</h2>

          {state?.success ? (
            <div>
              <p className="text-body text-primary mb-stack-lg">Password updated. Sign in with your new password.</p>
              <a href="/login" className="text-primary hover:underline">Sign in</a>
            </div>
          ) : (
            <form action={action} className="space-y-stack-md">
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="email" value={email} />

              <div>
                <label htmlFor="password" className="block text-label text-muted mb-1">New password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full border-b border-border py-2 text-body text-ink bg-transparent focus:outline-none focus:border-ink"
                  placeholder="At least 8 characters"
                />
                {state?.errors?.password && <p className="text-sm text-red-500 mt-1">{state.errors.password[0]}</p>}
              </div>

              {state?.message && <p className="text-sm text-red-500">{state.message}</p>}

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-primary text-white py-3 rounded-btn text-body font-medium disabled:opacity-50"
              >
                {pending ? "Saving..." : "Reset password"}
              </button>
            </form>
          )}

          <p className="mt-stack-xl text-center text-caps text-muted">Established 2024</p>
        </div>
      </div>
    </div>
  );
}
