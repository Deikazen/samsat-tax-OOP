import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const userLogin = response.data;

      localStorage.setItem("user", JSON.stringify(userLogin));

      if (userLogin.role === "ADMIN") {
        navigate("/admin");
      } else if (userLogin.role === "MASYARAKAT") {
        navigate("/masyarakat");
      } else {
        setError("Role akun tidak dikenali oleh sistem.");
      }
    } catch (error) {
      console.error("Login gagal:", error);
      setError("Login gagal. Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-badge">SAMSAT Digital</div>

        <h1>Kelola Pajak Kendaraan Jadi Lebih Mudah</h1>

        <p>
          Login untuk mengakses layanan kendaraan, tagihan pajak, pembayaran,
          dan pengaduan secara digital.
        </p>

        <div className="auth-feature-list">
          <div className="auth-feature-item">
            <span>01</span>
            <div>
              <h4>Cek Kendaraan</h4>
              <p>Lihat kendaraan yang terdaftar berdasarkan akun masyarakat.</p>
            </div>
          </div>

          <div className="auth-feature-item">
            <span>02</span>
            <div>
              <h4>Tagihan Pajak</h4>
              <p>Cek status pajak kendaraan dan informasi tagihan.</p>
            </div>
          </div>

          <div className="auth-feature-item">
            <span>03</span>
            <div>
              <h4>Pengaduan</h4>
              <p>Kirim pengaduan dan lihat status proses dari admin.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Masuk Akun</h2>
          <p className="auth-subtitle">
            Masukkan email dan password. Role akun akan dibaca otomatis dari
            database.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>

          <p className="auth-link">
            Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          </p>

          <div className="auth-demo">
            <p className="auth-demo-title">Akun Demo</p>
            <p>
              <b>Admin:</b> admin@samsat.go.id / admin123
            </p>
            <p>
              <b>Masyarakat:</b> satria@mail.com / rahasia123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;