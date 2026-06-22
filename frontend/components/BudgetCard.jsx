"use client";

export default function BudgetCard({ budget }) {
  const total = budget?.total ?? 0;

  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40">
      <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">Budget</p>
      <div className="mt-3 text-3xl font-semibold text-slate-900">${total}</div>
      <p className="mt-2 text-sm text-slate-500">
        {total ? "Estimated total trip spend" : "No budget set"}
      </p>
    </article>
  );
}
