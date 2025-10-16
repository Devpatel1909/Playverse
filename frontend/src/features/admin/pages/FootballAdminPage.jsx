import React from 'react';

const FootballAdminPage = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Football Admin Dashboard</h1>
        <p className="text-sm text-slate-300">Manage football teams, fixtures and scores</p>
      </header>

      <main className="space-y-6">
        <section className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="text-sm text-slate-300">This is a placeholder Football admin page. Replace with full UI when ready.</p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">Teams, Players and quick actions will appear here.</div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">Fixtures, scheduling and scoring tools will appear here.</div>
        </section>
      </main>
    </div>
  );
};

export default FootballAdminPage;
