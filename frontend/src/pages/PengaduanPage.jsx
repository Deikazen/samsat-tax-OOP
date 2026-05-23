import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function PengaduanPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [listPengaduan, setListPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategoriId, setKategoriId] = useState("1");

  useEffect(() => {
    getPengaduan();
  }, []);

  const getPengaduan = async () => {
    try {
      const response = await api.get("/pengaduan");

      if (Array.isArray(response.data)) {
        setListPengaduan(response.data);
      } else {
        setListPengaduan([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data pengaduan:", error);
      alert("Gagal mengambil data pengaduan dari backend");
    } finally {
      setLoading(false);
    }
  };

  const tambahPengaduan = async (e) => {
    e.preventDefault();

    if (!judul || !deskripsi || !kategoriId) {
      alert("Judul, deskripsi, dan kategori wajib diisi");
      return;
    }

    const dataPengaduan = {
      judul: judul,
      deskripsi: deskripsi,
      status: "MENUNGGU",
      pengguna: {
        id: user?.id,
      },
      listKategori: [
        {
          id: Number(kategoriId),
        },
      ],
    };

    try {
      await api.post("/pengaduan", dataPengaduan);

      alert("Pengaduan berhasil dikirim");

      setJudul("");
      setDeskripsi("");
      setKategoriId("1");

      getPengaduan();
    } catch (error) {
      console.error("Gagal mengirim pengaduan:", error);
      alert("Gagal mengirim pengaduan. Cek console atau backend.");
    }
  };

  const ubahStatus = async (id) => {
    const konfirmasi = confirm("Ubah status pengaduan menjadi SELESAI?");

    if (!konfirmasi) return;

    try {
      await api.put(`/pengaduan/${id}/status?status=SELESAI`);
      alert("Status pengaduan berhasil diubah");
      getPengaduan();
    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Gagal mengubah status pengaduan");
    }
  };

  const filteredPengaduan =
    user?.role === "MASYARAKAT"
      ? listPengaduan.filter(
          (item) =>
            item.pengguna?.id === user?.id ||
            item.pengguna?.nik === user?.nik ||
            item.pengguna?.email === user?.email
        )
      : listPengaduan;

  return (
    <div>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <div className="page-header">
            <div>
              <h1>Pengaduan</h1>
              <p>
                {user?.role === "ADMIN"
                  ? "Data seluruh pengaduan masyarakat dari backend."
                  : "Buat dan lihat status pengaduan Anda."}
              </p>
            </div>
          </div>

          {user?.role === "MASYARAKAT" && (
            <form className="form-card" onSubmit={tambahPengaduan}>
              <h3>Buat Pengaduan Baru</h3>

              <label>Judul Pengaduan</label>
              <input
                type="text"
                placeholder="Contoh: Data kendaraan belum muncul"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
              />

              <label>Kategori</label>
              <select
                value={kategoriId}
                onChange={(e) => setKategoriId(e.target.value)}
              >
                <option value="1">Pelayanan</option>
                <option value="2">Lalu Lintas</option>
                <option value="3">Pajak Kendaraan</option>
              </select>

              <label>Deskripsi</label>
              <textarea
                placeholder="Tulis detail pengaduan..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              ></textarea>

              <button type="submit">Kirim Pengaduan</button>
            </form>
          )}

          {loading ? (
            <div className="summary-card">
              <p>Loading data pengaduan...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Judul</th>
                  <th>Deskripsi</th>
                  <th>Nama Pengguna</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredPengaduan.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      {user?.role === "ADMIN"
                        ? "Belum ada data pengaduan."
                        : "Belum ada pengaduan untuk akun Anda."}
                    </td>
                  </tr>
                ) : (
                  filteredPengaduan.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.judul || "-"}</td>
                      <td>{item.deskripsi || "-"}</td>
                      <td>{item.pengguna?.nama || "-"}</td>
                      <td>
                        {item.listKategori && item.listKategori.length > 0
                          ? item.listKategori
                              .map((kategori) => kategori.namaKategori)
                              .join(", ")
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={
                            item.status === "SELESAI"
                              ? "status-success"
                              : "status-warning"
                          }
                        >
                          {item.status || "-"}
                        </span>
                      </td>
                      <td>
                        {user?.role === "ADMIN" &&
                          item.status !== "SELESAI" && (
                            <button onClick={() => ubahStatus(item.id)}>
                              Selesaikan
                            </button>
                          )}
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

export default PengaduanPage;