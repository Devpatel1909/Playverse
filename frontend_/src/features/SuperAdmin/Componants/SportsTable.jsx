import React from 'react';

export default function SportsTable({ rows, onAction }) {
  return (
    <div className="overflow-hidden border shadow-xl rounded-xl border-white/10 bg-white/5">
      <div className="grid grid-cols-11 px-6 py-4 text-sm font-semibold border-b text-slate-300 border-white/10 bg-white/5">
        <div className="col-span-2">Sport</div>
        <div className="col-span-1 text-center">Teams</div>
        <div className="col-span-1 text-center">Players</div>
        <div className="col-span-1 text-center">Sub-Admins</div>
        <div className="col-span-1 text-center">Events</div>
        <div className="col-span-2">Next Match</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-1 text-center">Actions</div>
      </div>
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <div className="w-16 h-16 mb-4 text-slate-600" />
          <p className="mb-2 text-lg">No sports found</p>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        rows.map((row) => (
          <div key={row.id} className="grid grid-cols-11 items-center px-6 py-4 border-b border-white/10 hover:bg-white/[0.03] transition-colors group">
            <div className="col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
                </div>
                <div>
                  <div className="font-medium text-white">{row.sport}</div>
                </div>
              </div>
            </div>
            <div className="col-span-1 text-center"><span className="px-2 py-1 text-sm font-medium text-blue-300 rounded-md bg-blue-500/20">{row.teams}</span></div>
            <div className="col-span-1 text-center"><span className="px-2 py-1 text-sm font-medium text-green-300 rounded-md bg-green-500/20">{row.players}</span></div>
            <div className="col-span-1 text-center"><span className="px-2 py-1 text-sm font-medium text-purple-300 rounded-md bg-purple-500/20">{row.subAdmins}</span></div>
            <div className="col-span-1 text-center"><span className="px-2 py-1 text-sm font-medium text-orange-300 rounded-md bg-orange-500/20">{row.activeEvents}</span></div>
            <div className="col-span-2"><div className="text-sm text-slate-300">{row.nextMatch}</div></div>
            <div className="col-span-2 text-center"><span className={"inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium " + (row.status === "Active" ? "bg-emerald-500/20 text-emerald-300" : row.status === "Paused" ? "bg-amber-500/20 text-amber-300" : "bg-sky-500/20 text-sky-300")}>{row.status}</span></div>
            <div className="col-span-1 text-center"><div className="flex items-center justify-center gap-2 transition-opacity opacity-0 group-hover:opacity-100">
              <button onClick={() => onAction && onAction('settings', row)} className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors">Settings</button>
              <button onClick={() => onAction && onAction('manage', row)} className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors">Manage</button>
            </div></div>
          </div>
        ))
      )}
    </div>
  );
}
