import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("ADMIN");
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
      const endpoint =
        role === "ADMIN" ? "/auth/login/admin" : "/auth/login/warga";

      const response = await api.post(endpoint, {
        email: email,
        password: password,
      });

      const userLogin = {
        ...response.data,
        role: role,
      };

      localStorage.setItem("user", JSON.stringify(userLogin));

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/masyarakat");
      }
    } catch (error) {
      console.error("Login gagal:", error);
      setError("Login gagal. Email, password, atau role salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Masuk Akun</h2>
        <p>Sistem Informasi Pajak Kendaraan Bermotor</p>

        {error && <div className="error">{error}</div>}

        <label>Login Sebagai</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="ADMIN">Admin</option>
          <option value="MASYARAKAT">Masyarakat</option>
        </select>

        <label>Email</label>
        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Masuk ke Dashboard"}
        </button>

        <div className="demo-account">
          <p>
            <b>Admin:</b> admin@samsat.go.id / admin123
          </p>
          <p>
            <b>Masyarakat:</b> satria@mail.com / rahasia123
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;