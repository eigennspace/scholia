"use client";

import { useActionState } from "react";
import { register, type RegisterState } from "@/features/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState<RegisterState, FormData>(register, {});

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="hidden lg:flex w-1/2 bg-canvas flex-col justify-center items-center p-stack-xl">
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-stack-lg" />
          <h1 className="font-serif text-display font-bold text-ink">Scholia</h1>
          <p className="font-serif text-reading text-muted mt-stack-md leading-reading">
            Your Digital Sanctuary for Thought
          </p>
          <div className="mt-stack-xl text-muted italic font-serif">"The Art of Curation"</div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-stack-xl">
        <div className="w-full max-w-sm">
          <h2 className="text-headline font-serif font-bold text-ink mb-stack-lg">Join the Library</h2>

          <form action={action} className="space-y-stack-md">
            <div>
              <label htmlFor="name" className="block text-label text-muted mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full border-b border-border py-2 text-body text-ink bg-transparent focus:outline-none focus:border-ink"
                placeholder="Your name"
              />
              {state?.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>}
            </div>

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

            <div>
              <label htmlFor="password" className="block text-label text-muted mb-1">Password</label>
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
              {pending ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-stack-lg text-center text-muted text-body">
            Already have access?{" "}
            <a href="/login" className="text-primary hover:underline">Sign In</a>
          </p>

          <p className="mt-stack-xl text-center text-caps text-muted">Established 2024</p>
        </div>
      </div>
    </div>
  );
}
