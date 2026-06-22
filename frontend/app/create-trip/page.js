"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";

const budgetOptions = ["Low", "Medium", "High"];

export default function CreateTripPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    destination: "",
    durationDays: 1,
    budgetTier: "Medium",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key) => (event) => {
    setForm({ ...form, [key]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        destination: form.destination,
        durationDays: Number(form.durationDays),
        budgetTier: form.budgetTier,
        interests: form.interests.split(",").map((item) => item.trim()),
      };

      await API.post("/trips", payload);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="glass-panel rounded-[2rem] p-7 lg:p-8">
          <div className="section-kicker">Create trip</div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white">
            Shape the trip before the itinerary takes over.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-white/64">
            Give the planner a clear destination, duration, and vibe, then let it generate a cleaner, more useful trip plan.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
              <p className="text-sm uppercase tracking-[0.22em] text-[#9fe1cb]">What you control</p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Destination, trip length, budget tier, and interests are all enough for a strong first draft.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
              <p className="text-sm uppercase tracking-[0.22em] text-[#9fe1cb]">What you get back</p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Day-by-day planning, budget snapshots, and a trip structure that feels much more polished.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-white/82 transition hover:bg-white/6 hover:text-white"
          >
            Back to dashboard
          </Link>
        </aside>

        <section className="surface-card rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#0b6d57]">Planner form</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Create travel plan</h2>
            </div>
            <div className="rounded-full bg-[#5dcaa5]/12 px-4 py-2 text-sm font-semibold text-[#0b6d57]">
              3 minute setup
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Destination</label>
              <input
                value={form.destination}
                onChange={handleChange("destination")}
                required
                placeholder="Tokyo, Japan"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5dcaa5] focus:ring-4 focus:ring-[#5dcaa5]/12"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Number of days</label>
                <input
                  type="number"
                  min="1"
                  value={form.durationDays}
                  onChange={handleChange("durationDays")}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#5dcaa5] focus:ring-4 focus:ring-[#5dcaa5]/12"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Budget tier</label>
                <select
                  value={form.budgetTier}
                  onChange={handleChange("budgetTier")}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#5dcaa5] focus:ring-4 focus:ring-[#5dcaa5]/12"
                >
                  {budgetOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Interests</label>
              <input
                value={form.interests}
                onChange={handleChange("interests")}
                placeholder="Food, Culture, Adventure, Shopping"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5dcaa5] focus:ring-4 focus:ring-[#5dcaa5]/12"
              />
              <p className="mt-2 text-xs text-slate-500">Separate each interest with a comma.</p>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating trip..." : "Generate itinerary"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
