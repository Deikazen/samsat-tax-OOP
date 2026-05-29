import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import MasyarakatDashboard from "./pages/MasyarakatDashboard";

import PenggunaPage from "./pages/PenggunaPage";
import KendaraanPage from "./pages/KendaraanPage";
import TagihanPage from "./pages/TagihanPage";
import PengaduanPage from "./pages/PengaduanPage";
import LaporanPage from "./pages/LaporanPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          user?.role === "ADMIN" ? (
            <Navigate to="/admin" replace />
          ) : user?.role === "MASYARAKAT" ? (
            <Navigate to="/masyarakat" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          user?.role === "ADMIN" ? (
            <Navigate to="/admin" replace />
          ) : user?.role === "MASYARAKAT" ? (
            <Navigate to="/masyarakat" replace />
          ) : (
            <Register />
          )
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pengguna"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <PenggunaPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/kendaraan"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <KendaraanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tagihan"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <TagihanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pengaduan"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <PengaduanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/laporan"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <LaporanPage />
          </ProtectedRoute>
        }
      />

      {/* MASYARAKAT ROUTES */}
      <Route
        path="/masyarakat"
        element={
          <ProtectedRoute allowedRole="MASYARAKAT">
            <MasyarakatDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/masyarakat/kendaraan"
        element={
          <ProtectedRoute allowedRole="MASYARAKAT">
            <KendaraanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/masyarakat/tagihan"
        element={
          <ProtectedRoute allowedRole="MASYARAKAT">
            <TagihanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/masyarakat/pengaduan"
        element={
          <ProtectedRoute allowedRole="MASYARAKAT">
            <PengaduanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          user?.role === "ADMIN" ? (
            <Navigate to="/admin" replace />
          ) : user?.role === "MASYARAKAT" ? (
            <Navigate to="/masyarakat" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;