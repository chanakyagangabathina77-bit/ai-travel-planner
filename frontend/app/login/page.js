"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1fr_0.92fr]">
        <section className="glass-panel rounded-[2rem] p-8 lg:p-10">
          <div className="section-kicker">Welcome back</div>
          <h1 className="mt-5 max-w-lg text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Continue where your next trip left off.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/65">
            Sign in to pick up your saved itineraries, budgets, and trip details without starting over.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-[#9fe1cb]">Saved plans</p>
              <p className="mt-2 text-sm leading-6 text-white/72">Keep all of your destinations in one account.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-[#9fe1cb]">Fast return</p>
              <p className="mt-2 text-sm leading-6 text-white/72">Jump straight back to your dashboard after sign in.</p>
            </div>
          </div>
        </section>

        <section className="surface-card rounded-[2rem] p-6 sm:p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#0b6d57]">Account access</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Login</h2>
            <p className="mt-3 text-slate-600">Access your AI travel dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#5dcaa5] focus:ring-4 focus:ring-[#5dcaa5]/12"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#5dcaa5] focus:ring-4 focus:ring-[#5dcaa5]/12"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-slate-950 hover:underline">
              Register
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
