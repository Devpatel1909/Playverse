import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./features/admin/pages/AdminLogin.jsx";
import AdminSportsOverview from "./features/admin/pages/CricketAdminPage.jsx";
import SuperAdminEntry from "./features/SuperAdmin/Pages/SuperAdminEntry.jsx";
import SuperAdminSportsOverview from "./features/SuperAdmin/Pages/SuperAdminSportsOverview.jsx";
import CricketManagement from "./features/cricket/components/CricketManagement.jsx";
import CricketScoringWrapper from "./features/cricket/components/CricketScoringWrapper.jsx";

import FootballManagement from "./features/football/components/FootballManagement.jsx"; // <-- Add this import
import FootballAdminPage from "./features/admin/pages/FootballAdminPage.jsx";
import BasketballAdminPage from "./features/admin/pages/BasketballAdminPage.jsx";
import TennisAdminPage from "./features/admin/pages/TennisAdminPage.jsx";
import APIConnectionTest from "./components/APIConnectionTest.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import SuperAdminDebug from "./components/SuperAdminDebug.jsx";
import PublicScoreView from "./features/users/pages/PublicScoreView.jsx";
import MatchDetailPage from "./features/users/pages/MatchDetailPage.jsx";
import SchedulePage from "./features/users/pages/SchedulePage.jsx";
import ArchivesPage from "./features/users/pages/ArchivesPage.jsx";
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicScoreView />} />
      <Route path="/scores" element={<PublicScoreView />} />
      <Route path="/scores/:sport" element={<PublicScoreView />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/archives" element={<ArchivesPage />} />
      <Route path="/match/:matchId" element={<MatchDetailPage />} />

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

      {/* Cricket Admin Page (login redirects here) */}
      <Route path="/admin/cricket" element={
        <AdminProtectedRoute requiredSport="cricket">
          <AdminSportsOverview />
        </AdminProtectedRoute>
      } />

      {/* Cricket Live Scoring */}
      <Route path="/admin/cricket/score/:matchId" element={
        <AdminProtectedRoute requiredSport="cricket">
          <CricketScoringWrapper />
        </AdminProtectedRoute>
      } />

   


      {/* Super Admin - now with particle text effect */}
      <Route path="/superadmin/login" element={<SuperAdminEntry />} />
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
      
 
      <Route path="/football-management" element={
        <ProtectedRoute>
          <FootballManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/football" element={
        <AdminProtectedRoute requiredSport="football">
          <FootballAdminPage />
        </AdminProtectedRoute>
      } />

      <Route path="/admin/basketball" element={
        <AdminProtectedRoute requiredSport="basketball">
          <BasketballAdminPage />
        </AdminProtectedRoute>
      } />

      <Route path="/admin/tennis" element={
        <AdminProtectedRoute requiredSport="tennis">
          <TennisAdminPage />
        </AdminProtectedRoute>
      } />
  {/* Placeholder for public pages */}
      {/* Additional sport management routes
      <Route path="/basketball-management" element={
        <AdminProtectedRoute requiredSport="basketball">
          <AdminSportsOverview />
        </AdminProtectedRoute>
      } />
      <Route path="/tennis-management" element={
        <AdminProtectedRoute requiredSport="tennis">
          <AdminSportsOverview />
        </AdminProtectedRoute>
      } /> */}

      {/* 404 */}
      <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-white bg-slate-900">404 - Not Found</div>} />
    </Routes>
  );
}

export default App;