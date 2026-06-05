import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  UserRound,
} from "lucide-react";
import api from "../services/api";
import PremiumBackground from "../components/PremiumBackground";
import TiltCard from "../components/TiltCard";

function Register() {
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nama || !email || !password || !nik) {
      setError("Nama, email, password, dan NIK wajib diisi.");
      return;
    }

    if (nik.length !== 16) {
      setError("NIK harus tepat 16 digit.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register/warga", {
        nama,
        email,
        password,
        nik,
        alamat,
        noHp,
      });

      alert("Registrasi berhasil. Silakan login.");
      navigate("/login");
    } catch (error) {
      console.error("Registrasi gagal:", error);
      setError("Registrasi gagal. Email atau NIK mungkin sudah terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="tax-auth-page register-premium-page">
      <PremiumBackground dark />

      <Link to="/" className="back-home-btn">
        <ArrowLeft size={18} />
        Kembali ke Home
      </Link>

      <section className="tax-auth-left">
        <motion.div
          className="tax-badge"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <UserRound size={18} />
          Citizen Registration
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Daftar Akun Masyarakat untuk Layanan Pajak Digital.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Akun masyarakat digunakan untuk melihat kendaraan, tagihan pajak,
          pembayaran, bukti transaksi, dan pengaduan.
        </motion.p>

        <TiltCard className="tax-rule-card">
          <h3>Role Tidak Dipilih Manual</h3>
          <p>
            User yang registrasi dari halaman ini masuk sebagai masyarakat.
            Akun admin dikelola melalui sistem/admin panel.
          </p>
        </TiltCard>
      </section>

      <motion.section
        className="tax-auth-right"
        initial={{ opacity: 0, x: 44 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
      >
        <form className="tax-login-panel register-panel" onSubmit={handleRegister}>
          <div className="login-panel-header">
            <span>Create Account</span>
            <h2>Registrasi</h2>
            <p>Lengkapi data masyarakat untuk membuat akun.</p>
          </div>

          {error && <div className="tax-error">{error}</div>}

          <label className="tax-input-group">
            <span>Nama Lengkap</span>
            <div>
              <User size={18} />
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
          </label>

          <label className="tax-input-group">
            <span>Email</span>
            <div>
              <Mail size={18} />
              <input
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          <label className="tax-input-group">
            <span>Password</span>
            <div>
              <Lock size={18} />
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>

          <label className="tax-input-group">
            <span>NIK</span>
            <div>
              <UserRound size={18} />
              <input
                type="text"
                placeholder="NIK 16 digit"
                value={nik}
                maxLength="16"
                onChange={(e) => setNik(e.target.value)}
              />
            </div>
          </label>

          <label className="tax-input-group">
            <span>Alamat</span>
            <div>
              <MapPin size={18} />
              <input
                type="text"
                placeholder="Masukkan alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
            </div>
          </label>

          <label className="tax-input-group">
            <span>No HP</span>
            <div>
              <Phone size={18} />
              <input
                type="text"
                placeholder="Masukkan nomor HP"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
              />
            </div>
          </label>

          <button className="tax-primary-btn" type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Buat Akun"}
            <ArrowRight size={18} />
          </button>

          <p className="tax-auth-link">
            Sudah punya akun? <Link to="/login">Login</Link>
          </p>
        </form>
      </motion.section>
    </main>
  );
}

export default Register;