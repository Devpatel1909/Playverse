import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./features/admin/pages/AdminLogin.jsx";
import AdminSportsOverview from "./features/admin/pages/AdminSportsOverview.jsx";
import SuperAdminEntry from "./features/SuperAdmin/Pages/SuperAdminEntry.jsx";
import SuperAdminSportsOverview from "./features/SuperAdmin/Pages/SuperAdminSportsOverview.jsx";
import CricketManagement from "./features/cricket/components/CricketManagement.jsx";
import CricketScorerOverview from "./features/cricket/components/CricketScorerOverview.jsx";
import FootballManagement from "./features/football/components/FootballManagement.jsx";
import BasketballManagement from "./features/basketball/components/BasketballManagement.jsx";
import BadmintonManagement from "./features/badminton/components/BadmintonManagement.jsx";
import VolleyballManagement from "./features/volleyball/components/VolleyballManagement.jsx";
import TennisManagement from "./features/tennis/components/TennisManagement.jsx";
import TableTennisManagement from "./features/tabletennis/components/TableTennisManagement.jsx";
import HockeyManagement from "./features/hockey/components/HockeyManagement.jsx";
import APIConnectionTest from "./components/APIConnectionTest.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import SuperAdminDebug from "./components/SuperAdminDebug.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* API Connection Test */}
      <Route path="/test-connection" element={<APIConnectionTest />} />
      <Route path="/debug" element={<SuperAdminDebug />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/overview" element={
        <AdminProtectedRoute>
          <AdminSportsOverview />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/sports" element={
        <AdminProtectedRoute>
          <AdminSportsOverview />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <AdminProtectedRoute>
          <AdminSportsOverview />
        </AdminProtectedRoute>
      } />

      {/* Super Admin - now with particle text effect */}
      <Route path="/superadmin/login" element={<SuperAdminEntry />} />
      <Route path="/superadmin" element={
        <ProtectedRoute>
          <SuperAdminSportsOverview />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/sports" element={
        <ProtectedRoute>
          <SuperAdminSportsOverview />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/dashboard" element={
        <ProtectedRoute>
          <SuperAdminSportsOverview />
        </ProtectedRoute>
      } />

      {/* Sport-Specific Admin Routes */}
      <Route path="/cricket-management" element={
        <AdminProtectedRoute requiredSport="cricket">
          <CricketManagement />
        </AdminProtectedRoute>
      } />
      
      <Route path="/cricket-scorer-overview" element={
        <AdminProtectedRoute requiredSport="cricket">
          <CricketScorerOverview />
        </AdminProtectedRoute>
      } />

      <Route path="/football-management" element={
        <ProtectedRoute>
          <FootballManagement />
        </ProtectedRoute>
      } />

      <Route path="/basketball-management" element={
        <ProtectedRoute>
          <BasketballManagement />
        </ProtectedRoute>
      } />

      <Route path="/badminton-management" element={
        <ProtectedRoute>
          <BadmintonManagement />
        </ProtectedRoute>
      } />

      <Route path="/volleyball-management" element={
        <ProtectedRoute>
          <VolleyballManagement />
        </ProtectedRoute>
      } />

      <Route path="/tennis-management" element={
        <ProtectedRoute>
          <TennisManagement />
        </ProtectedRoute>
      } />

      <Route path="/tabletennis-management" element={
        <ProtectedRoute>
          <TableTennisManagement />
        </ProtectedRoute>
      } />

      <Route path="/hockey-management" element={
        <ProtectedRoute>
          <HockeyManagement />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-white bg-slate-900">404 - Not Found</div>} />
    </Routes>
  );
}

export default App;
