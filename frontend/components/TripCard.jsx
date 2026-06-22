"use client";

export default function TripCard({ trip }) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{trip?.name || "Trip name"}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {trip?.notes || "Short description"}
          </p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          Active
        </div>
      </div>
    </article>
  );
}
