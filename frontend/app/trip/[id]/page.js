"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import API from "../../../services/api";

export default function TripPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [selectedDay, setSelectedDay] = useState(1);
  const [regenInputs, setRegenInputs] = useState({});

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTrip = async () => {
      try {
        const response = await API.get(`/trips/${id}`);
        setTrip(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load trip details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, router]);

  const handleAddActivity = async () => {
    if (!newActivity || !trip) return;

    try {
      const response = await API.put(`/trips/${id}/add-activity`, {
        dayNumber: selectedDay,
        activity: {
          title: newActivity,
          description: "Added by traveler",
          estimatedCostUSD: 0,
          timeOfDay: "Any",
        },
      });
      setTrip(response.data);
      setNewActivity("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add activity.");
    }
  };

  const handleRemoveActivity = async (dayNumber, activityTitle) => {
    try {
      const response = await API.put(`/trips/${id}/remove-activity`, {
        dayNumber,
        activityTitle,
      });
      setTrip(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove activity.");
    }
  };

  const handleRegenerateDay = async (dayNumber) => {
    const instruction = regenInputs[dayNumber];
    if (!instruction) return setError("Provide regeneration instruction.");

    try {
      const response = await API.put(`/trips/${id}/regenerate-day`, {
        dayNumber,
        instruction,
      });
      setTrip(response.data);
      setRegenInputs((state) => ({ ...state, [dayNumber]: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not regenerate day.");
    }
  };

  const itinerary = trip?.itinerary || [];
  const budget = trip?.estimatedBudget || {
    flights: 0,
    accommodation: 0,
    food: 0,
    activities: 0,
    total: 0,
  };
  const packingList = trip?.packingList || [];

  if (loading) {
    return (
      <main className="app-shell min-h-screen px-4 py-10 text-slate-100">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/8 bg-white/5 p-8 text-center">
          Loading trip details...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell min-h-screen px-4 py-10 text-slate-100">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/8 bg-white/5 p-8 text-center">
          <p className="text-lg font-semibold text-rose-200">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-full bg-[#5dcaa5] px-5 py-3 text-sm font-semibold text-[#04342c] transition hover:bg-[#9fe1cb]"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="section-kicker">Trip details</div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                {trip.destination}
              </h1>
              <p className="mt-3 text-base text-white/68">
                {trip.durationDays} days · {trip.budgetTier} budget plan
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-white/84 transition hover:bg-white/6 hover:text-white"
              >
                Back to dashboard
              </button>
              <Link
                href="/create-trip"
                className="rounded-full bg-[#5dcaa5] px-5 py-3 text-sm font-semibold text-[#04342c] transition hover:bg-[#9fe1cb]"
              >
                Create another trip
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="surface-card rounded-[1.75rem] p-5">
                <p className="text-sm text-slate-500">Days</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{trip.durationDays}</p>
              </div>
              <div className="surface-card rounded-[1.75rem] p-5">
                <p className="text-sm text-slate-500">Budget</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{trip.budgetTier}</p>
              </div>
              <div className="surface-card rounded-[1.75rem] p-5">
                <p className="text-sm text-slate-500">Interests</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {trip.interests?.join(", ") || "None"}
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6 sm:p-7">
              <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#9fe1cb]">Itinerary builder</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Add your own activity</h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none"
                  >
                    {itinerary.map((day) => (
                      <option key={day.dayNumber} value={day.dayNumber}>
                        Day {day.dayNumber}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Add activity"
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      className="min-w-0 flex-1 rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none"
                    />
                    <button
                      onClick={handleAddActivity}
                      className="rounded-full bg-[#5dcaa5] px-5 py-3 text-sm font-semibold text-[#04342c] transition hover:bg-[#9fe1cb]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {itinerary.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-8 text-center text-white/65">
                    No itinerary found for this trip.
                  </div>
                ) : (
                  itinerary.map((day) => (
                    <article key={day.dayNumber} className="rounded-[1.75rem] border border-white/8 bg-white/5 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold text-white">Day {day.dayNumber}</h3>
                          <p className="mt-2 text-sm text-white/60">
                            Regenerate the day or refine the plan with your own notes.
                          </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:w-[24rem]">
                          <input
                            type="text"
                            placeholder="Regeneration instruction"
                            value={regenInputs[day.dayNumber] || ""}
                            onChange={(e) =>
                              setRegenInputs((state) => ({ ...state, [day.dayNumber]: e.target.value }))
                            }
                            className="w-full rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none"
                          />
                          <button
                            onClick={() => handleRegenerateDay(day.dayNumber)}
                            className="rounded-full border border-[#5dcaa5]/20 bg-[#5dcaa5]/12 px-5 py-3 text-sm font-semibold text-[#9fe1cb] transition hover:bg-[#5dcaa5]/18"
                          >
                            Regenerate day
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 space-y-3">
                        {(day.activities || []).map((activity, idx) => (
                          <div key={idx} className="rounded-[1.4rem] border border-white/8 bg-[#0b1323] p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-lg font-semibold text-white">{activity.title}</p>
                                <p className="mt-1 text-sm text-white/60">
                                  {activity.description || "No details available."}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveActivity(day.dayNumber, activity.title)}
                                className="rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/6 hover:text-white"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="text-xl font-semibold text-white">Budget snapshot</h2>
              <div className="mt-5 space-y-4 text-white/72">
                <div className="flex justify-between text-sm">
                  <span>Flights</span>
                  <span>${budget.flights}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Accommodation</span>
                  <span>${budget.accommodation}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Food</span>
                  <span>${budget.food}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Activities</span>
                  <span>${budget.activities}</span>
                </div>
                <div className="flex justify-between border-t border-white/8 pt-4 text-sm font-semibold text-white">
                  <span>Total</span>
                  <span>${budget.total}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="text-xl font-semibold text-white">Packing checklist</h2>
              <div className="mt-5 space-y-3">
                {packingList.length ? (
                  packingList.map((item, index) => (
                    <div key={index} className="rounded-[1.4rem] border border-white/8 bg-white/5 p-4">
                      <p className="font-semibold text-white">{item.item}</p>
                      <p className="mt-1 text-sm text-white/58">{item.category}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/65">No packing items generated for this plan yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#5dcaa5]/20 bg-[#5dcaa5]/8 p-6 text-white">
              <h2 className="text-xl font-semibold">Quick tips</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/78">
                <li>Use regeneration to refresh a full day in seconds.</li>
                <li>Add your own activities to keep the itinerary flexible.</li>
                <li>Return to the dashboard anytime to manage all trips.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
