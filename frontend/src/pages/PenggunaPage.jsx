import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function PenggunaPage() {
  const [listPengguna, setListPengguna] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");

  useEffect(() => {
    getPengguna();
  }, []);

  const getPengguna = async () => {
    try {
      const response = await api.get("/pengguna");
      setListPengguna(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      alert("Gagal mengambil data masyarakat dari backend");
    } finally {
      setLoading(false);
    }
  };

  const tambahPengguna = async (e) => {
    e.preventDefault();

    if (!nama || !email || !password || !nik) {
      alert("Nama, email, password, dan NIK wajib diisi");
      return;
    }

    const dataPengguna = {
      nama,
      email,
      password,
      nik,
      alamat,
      noHp,
    };

    try {
      await api.post("/pengguna", dataPengguna);

      alert("Data masyarakat berhasil ditambahkan");

      setNama("");
      setEmail("");
      setPassword("");
      setNik("");
      setAlamat("");
      setNoHp("");
      setShowForm(false);

      getPengguna();
    } catch (error) {
      console.error("Gagal tambah pengguna:", error);
      alert("Gagal menambahkan data masyarakat. Cek backend atau console.");
    }
  };

  const hapusPengguna = async (id) => {
    const konfirmasi = confirm("Yakin ingin menghapus data ini?");

    if (!konfirmasi) return;

    try {
      await api.delete(`/pengguna/${id}`);
      alert("Data masyarakat berhasil dihapus");
      getPengguna();
    } catch (error) {
      console.error("Gagal hapus pengguna:", error);
      alert("Gagal menghapus data masyarakat");
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
              <h1>Kelola Data Masyarakat</h1>
              <p>Data masyarakat atau wajib pajak yang terdaftar dari database.</p>
            </div>

            <button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Tutup Form" : "+ Tambah Data"}
            </button>
          </div>

          {showForm && (
            <form className="form-card" onSubmit={tambahPengguna}>
              <h3>Tambah Data Masyarakat</h3>

              <label>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />

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
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label>NIK</label>
              <input
                type="text"
                placeholder="Masukkan NIK 16 digit"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
              />

              <label>Alamat</label>
              <input
                type="text"
                placeholder="Masukkan alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />

              <label>No HP</label>
              <input
                type="text"
                placeholder="Masukkan nomor HP"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
              />

              <button type="submit">Simpan Data</button>
            </form>
          )}

          {loading ? (
            <div className="summary-card">
              <p>Loading data masyarakat...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>NIK</th>
                  <th>Alamat</th>
                  <th>No HP</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {listPengguna.length === 0 ? (
                  <tr>
                    <td colSpan="7">Belum ada data masyarakat.</td>
                  </tr>
                ) : (
                  listPengguna.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.nama}</td>
                      <td>{item.email}</td>
                      <td>{item.nik}</td>
                      <td>{item.alamat || "-"}</td>
                      <td>{item.noHp || "-"}</td>
                      <td>
                        <button
                          className="btn-danger"
                          onClick={() => hapusPengguna(item.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}

export default PenggunaPage;