import React from "react";
import Badge from "../../cricket/UI/badge";

const SubAdminCard = ({
  name,
  email,
  perms,
  active,
  role,
  auth,
  teams,
  players,
  reports,
  matches,
}) => (
  <div className="w-[320px] bg-gradient-to-br from-[#1a2332] to-[#232b3e] rounded-xl p-4 shadow-lg">
    <div className="flex items-center gap-2 mb-2">
      <Badge>{name[0]}</Badge>
      <span className="text-lg font-bold text-white">{name}</span>
      <span className="ml-auto text-blue-400 font-semibold">{perms} Perms</span>
    </div>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-green-400 font-semibold">{active ? "Active" : "Inactive"}</span>
    </div>
    <div className="text-blue-300 mb-2">Team Management</div>
    <div className="grid grid-cols-2 gap-2 mb-2">
      <div className="bg-[#22304a] rounded p-2 text-center">
        <div className="text-xs text-blue-300">Teams</div>
        <div className="font-semibold text-white">{teams ? "✓" : "✗"}</div>
      </div>
      <div className="bg-[#22304a] rounded p-2 text-center">
        <div className="text-xs text-blue-300">Players</div>
        <div className="font-semibold text-white">{players ? "✓" : "✗"}</div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-2">
      <div className="bg-[#22304a] rounded p-2 text-center">
        <div className="text-xs text-purple-300">Reports</div>
        <div className="font-semibold text-white">{reports ? "✓" : "✗"}</div>
      </div>
      <div className="bg-[#3a2a2a] rounded p-2 text-center">
        <div className="text-xs text-yellow-300">Matches</div>
        <div className="font-semibold text-white">{matches ? "✓" : "✗"}</div>
      </div>
    </div>
    <div className="flex items-center justify-between mt-2">
      <span className="text-blue-400 text-sm">• {role}</span>
      {auth && <Badge color="green">Auth</Badge>}
    </div>
    <div className="mt-2 text-gray-300 text-xs">{email}</div>
  </div>
);

export default SubAdminCard;
