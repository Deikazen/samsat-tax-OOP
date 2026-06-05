import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import api from "../services/api";
import PremiumBackground from "../components/PremiumBackground";
import TiltCard from "../components/TiltCard";

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
    <main className="auth-clean-page">
      <PremiumBackground dark />

      <Link to="/" className="back-home-btn">
        <ArrowLeft size={18} />
        Kembali ke Home
      </Link>

      <section className="auth-clean-wrap">
        <motion.div
          className="auth-clean-copy"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="home-eyebrow">
            <ShieldCheck size={18} />
            Secure Login
          </div>

          <h1>Masuk ke Sistem SAMSAT Digital</h1>

          <p>
            Login untuk mengakses dashboard sesuai role akun. Admin dapat
            mengelola data pajak, sedangkan masyarakat dapat melihat kendaraan,
            tagihan, pembayaran, dan bukti bayar.
          </p>

          <TiltCard className="login-info-card">
            <h3>Role Otomatis</h3>
            <p>
              Role tidak dipilih oleh user. Sistem membaca role dari data akun
              yang tersimpan di database.
            </p>
          </TiltCard>
        </motion.div>

        <motion.form
          className="auth-clean-card"
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="auth-clean-header">
            <span>Welcome Back</span>
            <h2>Login Akun</h2>
            <p>Masukkan email dan password untuk melanjutkan.</p>
          </div>

          {error && <div className="tax-error">{error}</div>}

          <label className="auth-field-clean">
            <span>Email</span>
            <div>
              <Mail size={18} />
              <input
                type="email"
                placeholder="admin@samsat.go.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          <label className="auth-field-clean">
            <span>Password</span>
            <div>
              <Lock size={18} />
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>

          <button
            className="home-primary-btn auth-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login Dashboard"}
            <ArrowRight size={18} />
          </button>

          <p className="auth-bottom-text">
            Belum punya akun? <Link to="/register">Daftar masyarakat</Link>
          </p>

          <div className="auth-demo-mini">
            <span>Admin: admin@samsat.go.id / admin123</span>
            <span>Masyarakat: satria@mail.com / rahasia123</span>
          </div>
        </motion.form>
      </section>
    </main>
  );
}

export default Login;