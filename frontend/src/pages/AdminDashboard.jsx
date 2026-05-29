import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [summary, setSummary] = useState({
    totalWargaTerdaftar: 0,
    totalLayananPKB: 0,
    totalPengaduan: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSummary();
  }, []);

  const getSummary = async () => {
    try {
      const response = await api.get("/dashboard/summary");
      setSummary(response.data);
    } catch (error) {
      console.error("Gagal mengambil data summary:", error);
      alert("Gagal mengambil data dashboard dari backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <section className="dashboard-hero">
            <div>
              <span className="dashboard-badge">Admin Panel</span>
              <h1>Dashboard Admin SAMSAT Digital</h1>
              <p>
                Selamat datang, {user?.nama || "Admin"}. Kelola data
                masyarakat, kendaraan, tagihan pajak, laporan, dan pengaduan
                melalui satu dashboard.
              </p>
            </div>

            <div className="hero-status-card">
              <p>Status Sistem</p>
              <h3>Online</h3>
              <span>Backend & MySQL aktif</span>
            </div>
          </section>

          {loading ? (
            <div className="summary-card">
              <p>Loading data dashboard...</p>
            </div>
          ) : (
            <>
              <div className="dashboard-stat-grid">
                <div className="dashboard-stat-card">
                  <div className="stat-icon">👥</div>
                  <div>
                    <p>Total Masyarakat</p>
                    <h2>{summary.totalWargaTerdaftar}</h2>
                    <span>Data warga terdaftar</span>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="stat-icon">🧾</div>
                  <div>
                    <p>Total Layanan PKB</p>
                    <h2>{summary.totalLayananPKB}</h2>
                    <span>Tagihan dan layanan pajak</span>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="stat-icon">📨</div>
                  <div>
                    <p>Total Pengaduan</p>
                    <h2>{summary.totalPengaduan}</h2>
                    <span>Aduan masuk dari masyarakat</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-section-title">
                <h2>Menu Cepat Admin</h2>
                <p>Akses fitur utama sistem SAMSAT Digital.</p>
              </div>

              <div className="dashboard-menu-grid">
                <Link className="dashboard-menu-card" to="/admin/pengguna">
                  <span>👤</span>
                  <h3>Data Masyarakat</h3>
                  <p>Kelola data akun masyarakat yang terdaftar.</p>
                </Link>

                <Link className="dashboard-menu-card" to="/admin/kendaraan">
                  <span>🚗</span>
                  <h3>Data Kendaraan</h3>
                  <p>Kelola kendaraan yang dimiliki masyarakat.</p>
                </Link>

                <Link className="dashboard-menu-card" to="/admin/tagihan">
                  <span>💳</span>
                  <h3>Tagihan Pajak</h3>
                  <p>Kelola tagihan dan status pembayaran pajak.</p>
                </Link>

                <Link className="dashboard-menu-card" to="/admin/pengaduan">
                  <span>📩</span>
                  <h3>Pengaduan</h3>
                  <p>Lihat dan proses pengaduan dari masyarakat.</p>
                </Link>

                <Link className="dashboard-menu-card" to="/admin/laporan">
                  <span>📊</span>
                  <h3>Laporan Pajak</h3>
                  <p>Lihat rekap data pajak kendaraan dari database.</p>
                </Link>
              </div>

              <div className="summary-section">
                <div className="summary-card">
                  <h3>Fungsi Dashboard</h3>
                  <p>
                    Dashboard admin menampilkan ringkasan data dari backend
                    melalui endpoint <b>/api/dashboard/summary</b>. Admin dapat
                    mengakses data masyarakat, kendaraan, tagihan, pengaduan,
                    dan laporan pajak.
                  </p>
                </div>

                <div className="summary-card">
                  <h3>Koneksi Sistem</h3>
                  <p>
                    Frontend React mengambil data dari backend Spring Boot,
                    sedangkan backend menyimpan dan membaca data dari MySQL
                    Laragon.
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;