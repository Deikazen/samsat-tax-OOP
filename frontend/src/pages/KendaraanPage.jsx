import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function KendaraanPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [listKendaraan, setListKendaraan] = useState([]);
  const [listPengguna, setListPengguna] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [platNomor, setPlatNomor] = useState("");
  const [merek, setMerek] = useState("");
  const [tahun, setTahun] = useState("");
  const [penggunaId, setPenggunaId] = useState("");

  useEffect(() => {
    getKendaraan();

    if (user?.role === "ADMIN") {
      getPengguna();
    }
  }, []);

  const getKendaraan = async () => {
    try {
      let response;

      if (user?.role === "MASYARAKAT" && user?.nik) {
        response = await api.get(`/kendaraan/nik/${user.nik}`);
      } else {
        response = await api.get("/kendaraan");
      }

      if (Array.isArray(response.data)) {
        setListKendaraan(response.data);
      } else {
        setListKendaraan([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data kendaraan:", error);
      alert("Gagal mengambil data kendaraan dari backend");
    } finally {
      setLoading(false);
    }
  };

  const getPengguna = async () => {
    try {
      const response = await api.get("/pengguna");

      if (Array.isArray(response.data)) {
        setListPengguna(response.data);
      } else {
        setListPengguna([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      alert("Gagal mengambil data masyarakat untuk pilihan pemilik");
    }
  };

  const resetForm = () => {
    setPlatNomor("");
    setMerek("");
    setTahun("");
    setPenggunaId("");
    setEditId(null);
    setShowForm(false);
  };

  const simpanKendaraan = async (e) => {
    e.preventDefault();

    if (!platNomor || !merek || !tahun || !penggunaId) {
      alert("Plat nomor, merek, tahun, dan pemilik wajib diisi");
      return;
    }

    const dataKendaraan = {
      platNomor,
      merek,
      tahun: Number(tahun),
      pengguna: {
        id: Number(penggunaId),
      },
    };

    try {
      if (editId) {
        await api.put(`/kendaraan/${editId}`, dataKendaraan);
        alert("Data kendaraan berhasil diupdate");
      } else {
        await api.post("/kendaraan", dataKendaraan);
        alert("Data kendaraan berhasil ditambahkan");
      }

      resetForm();
      getKendaraan();
    } catch (error) {
      console.error("Gagal simpan kendaraan:", error);
      alert("Gagal menyimpan kendaraan. Cek backend atau console.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setPlatNomor(item.platNomor || "");
    setMerek(item.merek || "");
    setTahun(item.tahun || "");
    setPenggunaId(item.pengguna?.id || "");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const konfirmasi = confirm("Yakin ingin menghapus data kendaraan ini?");

    if (!konfirmasi) return;

    try {
      await api.delete(`/kendaraan/${id}`);
      alert("Data kendaraan berhasil dihapus");
      getKendaraan();
    } catch (error) {
      console.error("Gagal hapus kendaraan:", error);
      alert("Gagal menghapus kendaraan. Cek apakah kendaraan masih punya tagihan.");
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
              <h1>
                {user?.role === "ADMIN" ? "Data Kendaraan" : "Kendaraan Saya"}
              </h1>
              <p>
                {user?.role === "ADMIN"
                  ? "Kelola data kendaraan yang terdaftar di sistem."
                  : "Daftar kendaraan yang terdaftar atas akun Anda."}
              </p>
            </div>

            {user?.role === "ADMIN" && (
              <button
                onClick={() => {
                  if (showForm) {
                    resetForm();
                  } else {
                    setShowForm(true);
                  }
                }}
              >
                {showForm ? "Tutup Form" : "+ Tambah Kendaraan"}
              </button>
            )}
          </div>

          {showForm && user?.role === "ADMIN" && (
            <form className="form-card" onSubmit={simpanKendaraan}>
              <h3>{editId ? "Edit Data Kendaraan" : "Tambah Data Kendaraan"}</h3>

              <label>Pemilik Kendaraan</label>
              <select
                value={penggunaId}
                onChange={(e) => setPenggunaId(e.target.value)}
              >
                <option value="">Pilih pemilik kendaraan</option>
                {listPengguna.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} - {item.email} - {item.nik}
                  </option>
                ))}
              </select>

              <label>Plat Nomor</label>
              <input
                type="text"
                placeholder="Contoh: D5678DD"
                value={platNomor}
                onChange={(e) => setPlatNomor(e.target.value.toUpperCase())}
              />

              <label>Merek Kendaraan</label>
              <input
                type="text"
                placeholder="Contoh: Honda Beat"
                value={merek}
                onChange={(e) => setMerek(e.target.value)}
              />

              <label>Tahun Kendaraan</label>
              <input
                type="number"
                placeholder="Contoh: 2024"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
              />

              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button type="submit">
                  {editId ? "Update Kendaraan" : "Simpan Kendaraan"}
                </button>

                {editId && (
                  <button type="button" className="btn-danger" onClick={resetForm}>
                    Batal Edit
                  </button>
                )}
              </div>
            </form>
          )}

          {loading ? (
            <div className="summary-card">
              <p>Loading data kendaraan...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Plat Nomor</th>
                  <th>Merek</th>
                  <th>Tahun</th>
                  <th>Pemilik</th>
                  <th>Email Pemilik</th>
                  <th>NIK</th>
                  {user?.role === "ADMIN" && <th>Aksi</th>}
                </tr>
              </thead>

              <tbody>
                {listKendaraan.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === "ADMIN" ? "8" : "7"}>
                      {user?.role === "ADMIN"
                        ? "Belum ada data kendaraan."
                        : "Belum ada kendaraan yang terdaftar atas akun Anda."}
                    </td>
                  </tr>
                ) : (
                  listKendaraan.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.platNomor || "-"}</td>
                      <td>{item.merek || "-"}</td>
                      <td>{item.tahun || "-"}</td>
                      <td>{item.pengguna?.nama || "-"}</td>
                      <td>{item.pengguna?.email || "-"}</td>
                      <td>{item.pengguna?.nik || "-"}</td>

                      {user?.role === "ADMIN" && (
                        <td>
                          <button onClick={() => handleEdit(item)}>Edit</button>
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(item.id)}
                            style={{ marginLeft: "8px" }}
                          >
                            Hapus
                          </button>
                        </td>
                      )}
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

export default KendaraanPage;