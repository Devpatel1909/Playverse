import React from 'react';

const TennisAdminPage = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-pink-900 to-purple-900 text-white">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Tennis Admin Dashboard</h1>
        <p className="text-sm text-slate-300">Manage tennis tournaments, players and draws</p>
      </header>

      <main className="space-y-6">
        <section className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="text-sm text-slate-300">This is a placeholder Tennis admin page. Replace with full UI when ready.</p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">Tournaments, Players and quick actions will appear here.</div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">Draws, scheduling and scoring tools will appear here.</div>
        </section>
      </main>
    </div>
  );
};

export default TennisAdminPage;
