/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CricketScorerOverview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({
    team1: "",
    team2: "",
    venue: "",
    date: "",
    time: "",
  });

  const currentUserEmail = "cricket.admin2@sports.com";

  useEffect(() => {
    setLiveMatches([
      {
        id: 1,
        team1: "Mumbai Indians",
        team2: "Chennai Super Kings",
        venue: "Wankhede Stadium",
        organizer: "cricket.admin2@sports.com",
        status: "Live",
        startTime: "2025-08-24T14:30:00Z",
        currentScore: { team1: 158, team2: 89, overs: "12.2" },
      },
    ]);

    setUpcomingMatches([
      {
        id: 2,
        team1: "Rajasthan Royals",
        team2: "Sunrisers Hyderabad",
        venue: "Sawai Mansingh Stadium",
        organizer: "cricket.admin2@sports.com",
        status: "Scheduled",
        startTime: "2025-08-26T15:30:00Z",
      },
    ]);
  }, []);

  const handleScheduleMatch = (e) => {
    e.preventDefault();
    const matchDateTime = `${newMatch.date}T${newMatch.time}:00Z`;
    const newMatchData = {
      id: Date.now(),
      team1: newMatch.team1,
      team2: newMatch.team2,
      venue: newMatch.venue,
      organizer: currentUserEmail,
      status: "Scheduled",
      startTime: matchDateTime,
    };
    setUpcomingMatches([...upcomingMatches, newMatchData]);
    setShowScheduleModal(false);
    setNewMatch({ team1: "", team2: "", venue: "", date: "", time: "" });
  };

  const handleStartScoring = (matchId, organizer) => {
    if (organizer !== currentUserEmail) return;
    navigate(`/cricket-scorer/${matchId}`);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getAdminName = (email) =>
    email.split("@")[0].replace(".", " ").replace("cricket", "").replace("admin", "Admin");

  const isCurrentUserOrganizer = (email) => email === currentUserEmail;

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between px-8 py-6 border-b border-slate-700 bg-black/30 backdrop-blur-lg"
      >
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          🏏 Cricket Match Center
        </h1>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 text-sm rounded-lg bg-slate-800/60">
            Logged in as{" "}
            <span className="font-semibold text-emerald-400">
              {getAdminName(currentUserEmail)}
            </span>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-6 py-2 transition rounded-lg bg-emerald-600 hover:bg-emerald-700"
          >
            + Schedule Match
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 px-8 py-4">
        {["live", "upcoming"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-medium transition ${
              activeTab === tab
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {tab === "live"
              ? `Live Matches (${liveMatches.length})`
              : `Upcoming Matches (${upcomingMatches.length})`}
          </button>
        ))}
      </div>

      {/* Matches */}
      <div className="grid gap-6 px-8 py-6 md:grid-cols-2 lg:grid-cols-3">
        {(activeTab === "live" ? liveMatches : upcomingMatches).map((match) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`p-6 rounded-2xl border ${
              activeTab === "live"
                ? "border-red-500/40 bg-gradient-to-br from-red-900/30 to-slate-900/40"
                : "border-yellow-500/40 bg-gradient-to-br from-yellow-900/30 to-slate-900/40"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {match.team1} <span className="text-slate-400">vs</span> {match.team2}
              </h3>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  match.status === "Live"
                    ? "bg-red-600"
                    : "bg-yellow-600"
                }`}
              >
                {match.status}
              </span>
            </div>

            <p className="mb-2 text-sm text-slate-400">📍 {match.venue}</p>

            {match.status === "Live" ? (
              <div className="p-4 mb-4 bg-slate-800/60 rounded-xl">
                <div className="flex justify-between">
                  <span>{match.team1}</span>
                  <span className="font-bold text-emerald-400">
                    {match.currentScore.team1}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>{match.team2}</span>
                  <span className="font-bold text-emerald-400">
                    {match.currentScore.team2}
                  </span>
                </div>
                <p className="mt-2 text-xs text-right text-slate-400">
                  {match.currentScore.overs} overs
                </p>
              </div>
            ) : (
              <p className="mb-4 font-medium text-slate-300">
                Starts: <span className="text-emerald-400">{formatDate(match.startTime)}</span>
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Organizer:{" "}
                <span className="font-medium text-emerald-400">
                  {getAdminName(match.organizer)}
                </span>
              </span>
              <button
                onClick={() => handleStartScoring(match.id, match.organizer)}
                disabled={!isCurrentUserOrganizer(match.organizer)}
                className={`px-4 py-2 text-sm rounded-lg ${
                  isCurrentUserOrganizer(match.organizer)
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-slate-600 cursor-not-allowed"
                }`}
              >
                {isCurrentUserOrganizer(match.organizer)
                  ? match.status === "Live"
                    ? "Update Score"
                    : "Start Scoring"
                  : "View Only"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 border bg-slate-900 rounded-2xl border-slate-700"
          >
            <h2 className="mb-6 text-xl font-bold">Schedule Match</h2>
            <form onSubmit={handleScheduleMatch} className="space-y-4">
              {["team1", "team2", "venue"].map((field) => (
                <input
                  key={field}
                  type="text"
                  required
                  value={newMatch[field]}
                  onChange={(e) => setNewMatch({ ...newMatch, [field]: e.target.value })}
                  placeholder={`Enter ${field}`}
                  className="w-full p-3 border rounded-lg outline-none bg-slate-800 border-slate-700 focus:border-emerald-500"
                />
              ))}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  required
                  value={newMatch.date}
                  onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                  className="w-full p-3 border rounded-lg outline-none bg-slate-800 border-slate-700 focus:border-emerald-500"
                />
                <input
                  type="time"
                  required
                  value={newMatch.time}
                  onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                  className="w-full p-3 border rounded-lg outline-none bg-slate-800 border-slate-700 focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-3 rounded-lg bg-slate-600 hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CricketScorerOverview;
