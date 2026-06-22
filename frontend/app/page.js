"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const activities = [
  "Nakamise shopping street",
  "TeamLab Planets digital art",
  "Tsukiji outer market breakfast",
  "Harajuku and Takeshita Dori",
  "Shibuya crossing at night",
];

const featureCards = [
  {
    title: "Personalized routes",
    text: "AI maps each day around your pace, budget, and interests so every stop feels intentional.",
  },
  {
    title: "Budget clarity",
    text: "See totals and category splits before you book, with a clean overview that is easy to trust.",
  },
  {
    title: "Smart packing",
    text: "Build a destination-aware checklist that keeps your suitcase light and your trip organized.",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [charCount, setCharCount] = useState(1);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentText = activities[index];
    const isComplete = charCount === currentText.length;
    const isEmpty = charCount === 0;
    let timeout = 0;

    if (!deleting && !isComplete) {
      timeout = window.setTimeout(() => setCharCount((value) => value + 1), 72);
    } else if (!deleting && isComplete) {
      timeout = window.setTimeout(() => setDeleting(true), 1500);
    } else if (deleting && !isEmpty) {
      timeout = window.setTimeout(() => setCharCount((value) => value - 1), 42);
    } else if (deleting && isEmpty) {
      timeout = window.setTimeout(() => {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % activities.length);
      }, 180);
    }

    return () => window.clearTimeout(timeout);
  }, [index, charCount, deleting]);

  const typedText = activities[index].slice(0, charCount);

  return (
    <main className="app-shell min-h-screen overflow-hidden text-[#e8e2d9]">
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <nav className="glass-panel flex flex-col gap-4 rounded-[1.75rem] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#5dcaa5]" />
            Wayfarer AI
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 sm:gap-5">
            <Link href="/dashboard" className="rounded-full px-3 py-1.5 transition hover:bg-white/6 hover:text-white">
              Dashboard
            </Link>
            <Link href="/create-trip" className="rounded-full px-3 py-1.5 transition hover:bg-white/6 hover:text-white">
              Create Trip
            </Link>
            <Link href="/login" className="rounded-full px-3 py-1.5 transition hover:bg-white/6 hover:text-white">
              Login
            </Link>
          </div>
          <Link
            href="/create-trip"
            className="inline-flex items-center justify-center rounded-full bg-[#5dcaa5] px-5 py-3 text-sm font-semibold text-[#04342c] transition hover:bg-[#9fe1cb]"
          >
            Start planning
          </Link>
        </nav>

        <section className="grid gap-8 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-14">
          <div className="max-w-2xl space-y-8">
            <div className="section-kicker">AI-powered travel</div>
            <div className="space-y-5">
              <h1 className="max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Plan your next trip <span className="display-serif text-[#9fe1cb]">in minutes,</span> not hours.
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/68 sm:text-lg">
                Get a complete day-by-day itinerary, hotel ideas, budget breakdown, and packing list, all tailored to you in one place.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/create-trip"
                className="inline-flex items-center justify-center rounded-full bg-[#5dcaa5] px-6 py-3.5 text-sm font-semibold text-[#04342c] transition hover:bg-[#9fe1cb]"
              >
                Build my itinerary
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium text-white/82 transition hover:border-white/30 hover:text-white"
              >
                Explore features
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
                <div className="text-2xl font-semibold text-white">1200+</div>
                <div className="mt-1 text-sm text-white/60">Trips planned this month</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
                <div className="text-2xl font-semibold text-white">95%</div>
                <div className="mt-1 text-sm text-white/60">Traveler satisfaction</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
                <div className="text-2xl font-semibold text-white">3 min</div>
                <div className="mt-1 text-sm text-white/60">Average planning time</div>
              </div>
            </div>
          </div>

          <div className="glass-panel soft-grid rounded-[2rem] p-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d1526]">
              <div className="border-b border-white/8 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#5dcaa5]">AI itinerary preview</p>
                    <p className="mt-2 text-lg font-semibold text-white">Tokyo, Japan</p>
                  </div>
                  <div className="rounded-full border border-[#5dcaa5]/30 bg-[#5dcaa5]/10 px-3 py-1 text-xs font-semibold text-[#9fe1cb]">
                    Generating
                  </div>
                </div>
                <p className="mt-3 text-sm text-white/58">7 days. Culture and food focused. Budget-smart by default.</p>
              </div>

              <div className="space-y-4 px-5 py-5">
                <div className="rounded-[1.5rem] bg-white/4 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/38">Featured stop</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="h-10 w-10 rounded-2xl bg-[#5dcaa5]/15" />
                    <div>
                      <p className="font-semibold text-white">{typedText}</p>
                      <p className="text-sm text-white/55">A highlight that changes as the plan is refined.</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.35rem] bg-white/4 p-4">
                    <p className="text-sm text-white/48">Destination</p>
                    <p className="mt-2 text-sm font-semibold text-white">Tokyo, Paris, Bali</p>
                  </div>
                  <div className="rounded-[1.35rem] bg-white/4 p-4">
                    <p className="text-sm text-white/48">Trip length</p>
                    <p className="mt-2 text-sm font-semibold text-white">3 to 14 days</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/8 bg-[#09111f] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#5dcaa5]">Preview summary</p>
                  <p className="mt-3 text-base leading-7 text-white/78">
                    See your schedule, budget, and hotel plan in one calm interface instead of juggling tabs and notes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-4 pb-8 sm:grid-cols-3">
          {featureCards.map((feature, index) => (
            <article key={feature.title} className="surface-card rounded-[1.75rem] p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5dcaa5]/12 text-sm font-semibold text-[#0b6d57]">
                  0{index + 1}
                </span>
                <h2 className="text-xl font-semibold">{feature.title}</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </section>

        <section className="glass-panel rounded-[2rem] px-6 py-10 text-center sm:px-10">
          <div className="section-kicker justify-center">Get started</div>
          <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Your next adventure is <span className="display-serif text-[#9fe1cb]">three minutes away.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/60">
            No credit card needed. Just tell us where you want to go and let the planner do the heavy lifting.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/create-trip"
              className="inline-flex items-center justify-center rounded-full bg-[#5dcaa5] px-6 py-3.5 text-sm font-semibold text-[#04342c] transition hover:bg-[#9fe1cb]"
            >
              Plan a trip now
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium text-white/82 transition hover:border-white/30 hover:text-white"
            >
              Create free account
            </Link>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-3 border-t border-white/10 px-2 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>Copyright 2025 Wayfarer AI. Built for calmer trip planning.</span>
          <div className="flex flex-wrap gap-4">
            <Link href="#" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="#" className="transition hover:text-white">
              GitHub
            </Link>
          </div>
        </footer>
      </div>
      <div className="sr-only">{typedText}</div>
    </main>
  );
}
