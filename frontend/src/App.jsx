import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MasyarakatDashboard from "./pages/MasyarakatDashboard";
import PenggunaPage from "./pages/PenggunaPage";
import KendaraanPage from "./pages/KendaraanPage";
import TagihanPage from "./pages/TagihanPage";
import PengaduanPage from "./pages/PengaduanPage";
import LaporanPage from "./pages/LaporanPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/pengguna" element={<PenggunaPage />} />
      <Route path="/admin/kendaraan" element={<KendaraanPage />} />
      <Route path="/admin/tagihan" element={<TagihanPage />} />
      <Route path="/admin/pengaduan" element={<PengaduanPage />} />
      <Route path="/admin/laporan" element={<LaporanPage />} />

      <Route path="/masyarakat" element={<MasyarakatDashboard />} />
      <Route path="/masyarakat/kendaraan" element={<KendaraanPage />} />
      <Route path="/masyarakat/tagihan" element={<TagihanPage />} />
      <Route path="/masyarakat/pengaduan" element={<PengaduanPage />} />

      <Route
        path="*"
        element={
          user?.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : user?.role === "MASYARAKAT" ? (
            <Navigate to="/masyarakat" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;