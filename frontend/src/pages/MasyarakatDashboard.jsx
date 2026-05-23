import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MasyarakatDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <div className="page-header">
            <div>
              <h1>Dashboard Masyarakat</h1>
              <p>Selamat datang di layanan Samsat Digital.</p>
            </div>
          </div>

          <div className="profile-card">
            <div>
              <h2>{user?.nama || "Masyarakat"}</h2>
              <p>Email: {user?.email || "-"}</p>
              <p>NIK: {user?.nik || "-"}</p>
            </div>

            <span className="status-success">Aktif</span>
          </div>

          <div className="card-grid">
            <div className="card">
              <h3>Kendaraan Saya</h3>
              <h2>Data</h2>
              <p>Lihat data kendaraan yang terdaftar di sistem Samsat.</p>
              <Link className="card-link" to="/masyarakat/kendaraan">
                Lihat Kendaraan
              </Link>
            </div>

            <div className="card">
              <h3>Tagihan Pajak</h3>
              <h2>PKB</h2>
              <p>Cek layanan dan tagihan pajak kendaraan bermotor.</p>
              <Link className="card-link" to="/masyarakat/tagihan">
                Lihat Tagihan
              </Link>
            </div>

            <div className="card">
              <h3>Pengaduan Saya</h3>
              <h2>Help</h2>
              <p>Buat dan lihat status pengaduan yang dikirim ke admin.</p>
              <Link className="card-link" to="/masyarakat/pengaduan">
                Lihat Pengaduan
              </Link>
            </div>
          </div>

          <div className="summary-section">
            <div className="summary-card">
              <h3>Status Akun</h3>
              <p>
                Akun masyarakat sudah berhasil login melalui backend Spring Boot
                dan data akun disimpan sementara di localStorage frontend.
              </p>
            </div>

            <div className="summary-card">
              <h3>Informasi Sistem</h3>
              <p>
                Data dashboard masyarakat masih menampilkan ringkasan sederhana.
                Nanti bisa dikembangkan lagi jika backend menyediakan endpoint
                khusus masyarakat.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MasyarakatDashboard;