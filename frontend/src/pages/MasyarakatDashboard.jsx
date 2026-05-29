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
          <section className="dashboard-hero masyarakat-hero">
            <div>
              <span className="dashboard-badge">Dashboard Masyarakat</span>
              <h1>Selamat Datang, {user?.nama || "Masyarakat"}</h1>
              <p>
                Pantau kendaraan, tagihan pajak, pembayaran PKB, dan pengaduan
                Anda melalui layanan SAMSAT Digital.
              </p>
            </div>

            <div className="hero-status-card">
              <p>Status Akun</p>
              <h3>Aktif</h3>
              <span>{user?.role || "MASYARAKAT"}</span>
            </div>
          </section>

          <div className="profile-card dashboard-profile">
            <div>
              <span className="profile-label">Profil Akun</span>
              <h2>{user?.nama || "Masyarakat"}</h2>
              <p>Email: {user?.email || "-"}</p>
              <p>NIK: {user?.nik || "-"}</p>
              <p>Alamat: {user?.alamat || "-"}</p>
              <p>No HP: {user?.noHp || "-"}</p>
            </div>

            <span className="status-success">Terverifikasi</span>
          </div>

          <div className="dashboard-section-title">
            <h2>Layanan Masyarakat</h2>
            <p>Pilih layanan yang ingin digunakan.</p>
          </div>

          <div className="dashboard-menu-grid">
            <Link className="dashboard-menu-card" to="/masyarakat/kendaraan">
              <span>🚗</span>
              <h3>Kendaraan Saya</h3>
              <p>Lihat daftar kendaraan yang terdaftar atas nama Anda.</p>
            </Link>

            <Link className="dashboard-menu-card" to="/masyarakat/tagihan">
              <span>💳</span>
              <h3>Tagihan & Pembayaran</h3>
              <p>Cek tagihan pajak dan lakukan pembayaran pajak kendaraan.</p>
            </Link>

            <Link className="dashboard-menu-card" to="/masyarakat/pengaduan">
              <span>📨</span>
              <h3>Pengaduan Saya</h3>
              <p>Kirim pengaduan dan pantau status tanggapan dari admin.</p>
            </Link>
          </div>

          <div className="summary-section">
            <div className="summary-card">
              <h3>Alur Pembayaran Pajak</h3>
              <p>
                Masuk ke menu <b>Tagihan Saya</b>, pilih tagihan yang belum
                lunas, lalu klik tombol <b>Bayar</b>. Setelah berhasil, status
                tagihan akan berubah menjadi <b>LUNAS</b> dan tersimpan ke
                MySQL.
              </p>
            </div>

            <div className="summary-card">
              <h3>Informasi Sistem</h3>
              <p>
                Data akun login disimpan sementara di localStorage. Data
                kendaraan, tagihan, pembayaran, dan pengaduan diambil dari
                backend Spring Boot.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MasyarakatDashboard;