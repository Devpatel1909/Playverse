import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./features/admin/pages/AdminLogin.jsx";
import AdminSportsOverview from "./features/admin/pages/AdminSportsOverview.jsx";
import SuperAdminEntry from "./features/SuperAdmin/Pages/SuperAdminEntry.jsx";
import SuperAdminSportsOverview from "./features/SuperAdmin/Pages/SuperAdminSportsOverview.jsx";
import CricketManagement from "./features/cricket/components/CricketManagement.jsx";
import CricketLiveScoring from "./features/cricket/scoring/CricketLiveScoringUI.jsx";
import CricketScorerOverview from "./features/cricket/components/CricketScorerOverview.jsx";
import FootballManagement from "./features/football/components/FootballManagement.jsx"; // <-- Add this import
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
      <Route path="/superadmin/sports" element={
        <SuperAdminSportsOverview />
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
         
          <CricketLiveScoring />
        </AdminProtectedRoute>
      } />

      <Route path="/football-management" element={
        <AdminProtectedRoute requiredSport="football">
          <FootballManagement />
        </AdminProtectedRoute>
      } />

      {/* Additional sport management routes */}
      <Route path="/basketball-management" element={
        <AdminProtectedRoute requiredSport="basketball">
          <AdminSportsOverview />
        </AdminProtectedRoute>
      } />
      <Route path="/tennis-management" element={
        <AdminProtectedRoute requiredSport="tennis">
          <AdminSportsOverview />
        </AdminProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-white bg-slate-900">404 - Not Found</div>} />
    </Routes>
  );
}

export default App;
