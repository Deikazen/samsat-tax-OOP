import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function AdminDashboard() {
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
          <div className="page-header">
            <div>
              <h1>Dashboard Admin</h1>
              <p>Ringkasan data sistem informasi pajak kendaraan.</p>
            </div>
          </div>

          {loading ? (
            <div className="summary-card">
              <p>Loading data dashboard...</p>
            </div>
          ) : (
            <>
              <div className="card-grid">
                <div className="card">
                  <h3>Total Warga Terdaftar</h3>
                  <h2>{summary.totalWargaTerdaftar}</h2>
                  <p>Data warga yang terdaftar di database.</p>
                  <Link className="card-link" to="/admin/pengguna">
                    Lihat Data
                  </Link>
                </div>

                <div className="card">
                  <h3>Total Layanan PKB</h3>
                  <h2>{summary.totalLayananPKB}</h2>
                  <p>Total layanan pajak kendaraan bermotor.</p>
                  <Link className="card-link" to="/admin/tagihan">
                    Lihat Layanan
                  </Link>
                </div>

                <div className="card">
                  <h3>Total Pengaduan</h3>
                  <h2>{summary.totalPengaduan}</h2>
                  <p>Total pengaduan yang masuk dari warga.</p>
                  <Link className="card-link" to="/admin/pengaduan">
                    Lihat Pengaduan
                  </Link>
                </div>
              </div>

              <div className="summary-section">
                <div className="summary-card">
                  <h3>Status Koneksi Backend</h3>
                  <p>
                    Frontend sudah berhasil mengambil data dari backend Spring
                    Boot melalui endpoint <b>/api/dashboard/summary</b>.
                  </p>
                </div>

                <div className="summary-card">
                  <h3>Status Sistem</h3>
                  <p>
                    Backend, database MySQL Laragon, dan frontend React sudah
                    mulai terhubung.
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