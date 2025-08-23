import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./features/admin/pages/AdminLogin.jsx";
import AdminSportsOverview from "./features/admin/pages/AdminSportsOverview.jsx"
import SuperAdminEntry from "./features/SuperAdmin/Pages/SuperAdminEntry.jsx";
import SuperAdminSportsOverview from "./features/SuperAdmin/Pages/SuperAdminSportsOverview.jsx";
import CricketManagement from "./features/cricket/components/CricketManagement.jsx";
import APIConnectionTest from "./components/APIConnectionTest.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SuperAdminDebug from "./components/SuperAdminDebug.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/superadmin/login" replace />} />

      {/* API Connection Test */}
      <Route path="/test-connection" element={<APIConnectionTest />} />
      <Route path="/debug" element={<SuperAdminDebug />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/sports" element={<AdminSportsOverview />} />

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

      {/* Cricket Management */}
      <Route path="/cricket-management" element={<CricketManagement />} />

      {/* 404 */}
      <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-white bg-slate-900">404 - Not Found</div>} />
    </Routes>
  );
}

export default App;
