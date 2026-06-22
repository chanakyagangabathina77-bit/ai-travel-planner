"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";

export default function DashboardPage() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    const loadTrips = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await API.get("/trips");
        setTrips(response.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load trips. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    void loadTrips();
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this trip? This action cannot be undone.")) return;

    try {
      await API.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter((trip) => trip._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Could not delete trip.");
    }
  };

  const totalTrips = trips.length;
  const avgDays = trips.length
    ? Math.round(trips.reduce((sum, trip) => sum + (trip.durationDays || 0), 0) / trips.length)
    : 0;
  const totalEstimated = trips.reduce(
    (sum, trip) => sum + ((trip.estimatedBudget && trip.estimatedBudget.total) || 0),
    0
  );

  return (
    <main className="app-shell min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="glass-panel flex flex-col gap-5 rounded-[1.75rem] px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="h-10 w-10 rounded-2xl bg-[#5dcaa5]/15" />
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#9fe1cb]">Wayfarer AI</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">Your travel HQ</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              My trips
            </Link>
            <Link href="/create-trip" className="rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/6 hover:text-white">
              Create trip
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/82 transition hover:border-white/20 hover:bg-white/6"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="surface-card rounded-[1.75rem] p-5">
            <p className="text-sm text-slate-500">Trips created</p>
            <div className="mt-3 text-4xl font-semibold text-slate-900">{totalTrips}</div>
            <p className="mt-2 text-sm text-slate-600">All plans live in one clean workspace.</p>
          </div>
          <div className="surface-card rounded-[1.75rem] p-5">
            <p className="text-sm text-slate-500">Average length</p>
            <div className="mt-3 text-4xl font-semibold text-slate-900">
              {avgDays}
              <span className="ml-2 text-base font-medium text-slate-500">days</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">A quick read on how detailed your trips are.</p>
          </div>
          <div className="surface-card rounded-[1.75rem] p-5">
            <p className="text-sm text-slate-500">Total planned value</p>
            <div className="mt-3 text-4xl font-semibold text-slate-900">${totalEstimated}</div>
            <p className="mt-2 text-sm text-slate-600">Estimated spend across all saved journeys.</p>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9fe1cb]">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Upcoming trips</h2>
            </div>
            <Link
              href="/create-trip"
              className="inline-flex items-center justify-center rounded-full bg-[#5dcaa5] px-5 py-3 text-sm font-semibold text-[#04342c] transition hover:bg-[#9fe1cb]"
            >
              + New trip
            </Link>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-8 text-center text-white/70">
                Loading your trips...
              </div>
            ) : error ? (
              <div className="rounded-[1.5rem] border border-rose-400/20 bg-rose-500/10 p-4 text-rose-100">
                {error}
              </div>
            ) : trips.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/4 p-8 text-center">
                <div className="mx-auto max-w-md">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#9fe1cb]">No trips yet</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Where to next?</h3>
                  <p className="mt-3 text-white/65">
                    Let AI map your next adventure in under three minutes.
                  </p>
                  <Link
                    href="/create-trip"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[#5dcaa5] px-5 py-3 text-sm font-semibold text-[#04342c] transition hover:bg-[#9fe1cb]"
                  >
                    Plan a new trip
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {trips.map((trip) => {
                  const interests = (trip.interests || []).slice(0, 2);

                  return (
                    <article
                      key={trip._id}
                      className="rounded-[1.75rem] border border-white/8 bg-white/5 p-5 transition hover:border-white/15 hover:bg-white/7"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5dcaa5]/15 text-lg font-semibold text-[#9fe1cb]">
                            {trip.destination ? trip.destination.slice(0, 1).toUpperCase() : "T"}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{trip.destination || "Unknown destination"}</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="rounded-full border border-[#5dcaa5]/20 bg-[#5dcaa5]/10 px-3 py-1 text-xs font-semibold text-[#9fe1cb]">
                                {trip.budgetTier || "Medium"} budget
                              </span>
                              {interests.map((interest) => (
                                <span
                                  key={interest}
                                  className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/78"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                            <p className="mt-3 text-sm text-white/55">{trip.durationDays || 0} days planned</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                          <div className="text-2xl font-semibold text-white">${trip.estimatedBudget?.total ?? 0}</div>
                          <div className="flex gap-2">
                            <Link
                              href={`/trip/${trip._id}`}
                              className="rounded-full bg-[#5dcaa5] px-4 py-2 text-sm font-semibold text-[#04342c] transition hover:bg-[#9fe1cb]"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDelete(trip._id)}
                              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/6 hover:text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
