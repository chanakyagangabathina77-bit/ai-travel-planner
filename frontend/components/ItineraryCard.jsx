"use client";

export default function ItineraryCard({ item }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-10 w-10 rounded-2xl bg-emerald-50" />
        <div className="min-w-0">
          <div className="font-semibold text-slate-900">{item?.title || "Activity"}</div>
          <div className="mt-1 text-sm text-slate-500">{item?.time || "Time"}</div>
          {item?.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p> : null}
        </div>
      </div>
    </article>
  );
}
