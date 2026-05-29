import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

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
    <div className="auth-page register-page">
      <div className="auth-left">
        <div className="auth-badge">Registrasi Masyarakat</div>

        <h1>Buat Akun SAMSAT Digital</h1>

        <p>
          Daftar sebagai masyarakat untuk melihat kendaraan, tagihan pajak,
          pembayaran pajak, dan mengirim pengaduan.
        </p>

        <div className="auth-note-box">
          <h4>Catatan Role</h4>
          <p>
            User tidak memilih role sendiri. Akun registrasi akan masuk sebagai
            masyarakat, sedangkan admin dikelola melalui dashboard/admin panel.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-card register-card" onSubmit={handleRegister}>
          <h2>Daftar Akun</h2>
          <p className="auth-subtitle">
            Lengkapi data berikut untuk membuat akun masyarakat.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label>Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>

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
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>NIK</label>
            <input
              type="text"
              placeholder="Masukkan NIK 16 digit"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              maxLength="16"
            />
          </div>

          <div className="auth-field">
            <label>Alamat</label>
            <input
              type="text"
              placeholder="Masukkan alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>No HP</label>
            <input
              type="text"
              placeholder="Masukkan nomor HP"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </button>

          <p className="auth-link">
            Sudah punya akun? <Link to="/login">Login di sini</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;