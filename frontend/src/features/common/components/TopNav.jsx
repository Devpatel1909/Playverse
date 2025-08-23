export default function TopNav({ title = "Dashboard", role = "Admin", user = { name: "Admin", email: "admin@example.com" }, onSignOut }) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">S</div>
            <div className="leading-tight">
              <div className="text-sm text-slate-400">{role}</div>
              <div className="text-base font-semibold text-white">{title}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-sm text-white font-medium">{user.name}</span>
              <span className="text-xs text-slate-400">{user.email}</span>
            </div>
            <div className="size-9 rounded-full bg-white/10 border border-white/10" />
            <button
              onClick={onSignOut}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
