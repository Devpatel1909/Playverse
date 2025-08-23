import { useMemo, useState } from "react";

const MOCK_SPORTS = [
  { id: 1, sport: "Cricket", leagues: ["IPL", "BBL"], activeEvents: 3, nextMatch: "2025-08-25 19:30", status: "Active" },
  { id: 2, sport: "Football", leagues: ["EPL", "La Liga", "UCL"], activeEvents: 5, nextMatch: "2025-08-24 21:00", status: "Active" },
  { id: 3, sport: "Basketball", leagues: ["NBA"], activeEvents: 0, nextMatch: "—", status: "Paused" },
  { id: 4, sport: "Tennis", leagues: ["ATP", "WTA"], activeEvents: 2, nextMatch: "2025-08-23 16:00", status: "Active" },
  { id: 5, sport: "Hockey", leagues: ["NHL"], activeEvents: 1, nextMatch: "2025-08-27 18:00", status: "Planned" },
];

const STATUS_OPTIONS = ["All", "Active", "Paused", "Planned"];

export default function AdminSportsOverview() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return MOCK_SPORTS.filter((s) => {
      const matchesQuery = `${s.sport} ${s.leagues.join(" ")}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "All" ? true : s.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const stats = useMemo(() => {
    const totalSports = MOCK_SPORTS.length;
    const activeEvents = MOCK_SPORTS.reduce((acc, s) => acc + s.activeEvents, 0);
    const activeSports = MOCK_SPORTS.filter((s) => s.status === "Active").length;
    return { totalSports, activeEvents, activeSports };
  }, []);

  return (
    <div className="min-h-screen text-white bg-slate-950">
      <div className="max-w-6xl px-4 py-8 mx-auto">
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin • Sports Overview</h1>
            <p className="text-slate-400">Manage sports, leagues and live events</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500">Add Sport</button>
            <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700">Import</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
          <div className="p-4 border rounded-xl border-white/10 bg-white/5">
            <div className="text-sm text-slate-400">Total Sports</div>
            <div className="text-2xl font-semibold">{stats.totalSports}</div>
          </div>
          <div className="p-4 border rounded-xl border-white/10 bg-white/5">
            <div className="text-sm text-slate-400">Active Events</div>
            <div className="text-2xl font-semibold">{stats.activeEvents}</div>
          </div>
          <div className="p-4 border rounded-xl border-white/10 bg-white/5">
            <div className="text-sm text-slate-400">Active Sports</div>
            <div className="text-2xl font-semibold">{stats.activeSports}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by sport or league..."
            className="flex-1 px-4 py-2 border rounded-lg bg-slate-900 border-white/10 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-slate-900 border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden border rounded-xl border-white/10 bg-white/5">
          <div className="grid grid-cols-12 px-4 py-3 text-sm border-b text-slate-400 border-white/10 bg-white/5">
            <div className="col-span-3">Sport</div>
            <div className="col-span-4">Leagues</div>
            <div className="col-span-2 text-center">Active Events</div>
            <div className="col-span-2">Next Match</div>
            <div className="col-span-1 text-center">Status</div>
          </div>
          {filtered.length === 0 ? (
            <div className="p-6 text-slate-400">No sports found.</div>
          ) : (
            filtered.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-12 items-center px-4 py-3 border-b border-white/10 hover:bg-white/[0.03]"
              >
                <div className="col-span-3 font-medium">{row.sport}</div>
                <div className="col-span-4 truncate text-slate-300">{row.leagues.join(", ")}</div>
                <div className="col-span-2 text-center">{row.activeEvents}</div>
                <div className="col-span-2">{row.nextMatch}</div>
                <div className="col-span-1 text-center">
                  <span
                    className={
                      "inline-flex items-center justify-center px-2 py-1 rounded-full text-xs " +
                      (row.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : row.status === "Paused"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-sky-500/20 text-sky-300")
                    }
                  >
                    {row.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}