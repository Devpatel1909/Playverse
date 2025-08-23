import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@example.com" && password === "admin123") {
      setIsAdmin(true);
      navigate("/admin/sports", { replace: true });
    } else {
      setIsAdmin(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-800">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-white mb-6">Admin Login</h1>
        {isAdmin === null ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              Login
            </button>
          </form>
        ) : isAdmin ? (
          <div className="text-white">
            <h2 className="text-3xl font-semibold">✅ Welcome Admin!</h2>
            <p className="mt-3 text-lg">You have full access to the dashboard.</p>
          </div>
        ) : (
          <div className="text-red-300">
            <h2 className="text-2xl font-bold">❌ Access Denied</h2>
            <p className="mt-2">You are not authorized as an admin.</p>
            <button
              onClick={() => setIsAdmin(null)}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;
