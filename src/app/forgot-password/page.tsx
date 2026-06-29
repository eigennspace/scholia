"use client";

import { useActionState } from "react";
import { forgotPassword, type ForgotPasswordState } from "@/features/auth/actions/forgot-password";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState<ForgotPasswordState, FormData>(forgotPassword, {});

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 bg-canvas flex-col justify-center items-center p-stack-xl">
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-stack-lg" />
          <h1 className="font-serif text-display font-bold text-ink">Scholia</h1>
          <p className="font-serif text-reading text-muted mt-stack-md leading-reading">
            Your Digital Sanctuary for Thought
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-stack-xl">
        <div className="w-full max-w-sm">
          <h2 className="text-headline font-serif font-bold text-ink mb-stack-lg">Reset your password</h2>

          {state?.success ? (
            <div>
              <p className="text-body text-primary mb-stack-lg">Check your email for a reset link.</p>
              <a href="/login" className="text-primary hover:underline">Back to sign in</a>
            </div>
          ) : (
            <form action={action} className="space-y-stack-md">
              <div>
                <label htmlFor="email" className="block text-label text-muted mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full border-b border-border py-2 text-body text-ink bg-transparent focus:outline-none focus:border-ink"
                  placeholder="you@example.com"
                />
                {state?.errors?.email && <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>}
              </div>

              {state?.message && <p className="text-sm text-red-500">{state.message}</p>}

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-primary text-white py-3 rounded-btn text-body font-medium disabled:opacity-50"
              >
                {pending ? "Sending..." : "Send reset link"}
              </button>

              <p className="text-center text-muted text-body">
                <a href="/login" className="text-primary hover:underline">Back to sign in</a>
              </p>
            </form>
          )}

          <p className="mt-stack-xl text-center text-caps text-muted">Established 2024</p>
        </div>
      </div>
    </div>
  );
}
