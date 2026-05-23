import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function TagihanPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [listLayanan, setListLayanan] = useState([]);
  const [listKendaraan, setListKendaraan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [kendaraanId, setKendaraanId] = useState("");
  const [tahunPajak, setTahunPajak] = useState("");
  const [nominalTagihan, setNominalTagihan] = useState("");
  const [statusLayanan, setStatusLayanan] = useState("MENUNGGU");

  useEffect(() => {
    getLayanan();
    getKendaraan();
  }, []);

  const getLayanan = async () => {
    try {
      const response = await api.get("/layanan");

      if (Array.isArray(response.data)) {
        setListLayanan(response.data);
      } else {
        setListLayanan([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data layanan:", error);
      alert("Gagal mengambil data tagihan/layanan dari backend");
    } finally {
      setLoading(false);
    }
  };

  const getKendaraan = async () => {
    try {
      const response = await api.get("/kendaraan");

      if (Array.isArray(response.data)) {
        setListKendaraan(response.data);
      } else {
        setListKendaraan([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data kendaraan:", error);
    }
  };

  const tambahLayanan = async (e) => {
    e.preventDefault();

    if (!kendaraanId || !tahunPajak || !nominalTagihan || !statusLayanan) {
      alert("Semua data wajib diisi");
      return;
    }

    const dataLayanan = {
      tahunPajak: Number(tahunPajak),
      nominalTagihan: Number(nominalTagihan),
      statusLayanan: statusLayanan,
      kendaraan: {
        id: Number(kendaraanId),
      },
    };

    try {
      await api.post("/layanan", dataLayanan);

      alert("Data layanan/tagihan berhasil ditambahkan");

      setKendaraanId("");
      setTahunPajak("");
      setNominalTagihan("");
      setStatusLayanan("MENUNGGU");
      setShowForm(false);

      getLayanan();
    } catch (error) {
      console.error("Gagal tambah layanan:", error);
      alert("Gagal menambahkan layanan/tagihan. Cek console atau backend.");
    }
  };

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return `Rp ${Number(angka).toLocaleString("id-ID")}`;
  };

  const filteredLayanan =
    user?.role === "MASYARAKAT"
      ? listLayanan.filter(
          (item) => item.kendaraan?.pengguna?.nik === user?.nik
        )
      : listLayanan;

  return (
    <div>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <div className="page-header">
            <div>
              <h1>Tagihan Pajak</h1>
              <p>
                {user?.role === "ADMIN"
                  ? "Data seluruh layanan PKB dari backend Spring Boot."
                  : "Data tagihan pajak kendaraan milik Anda."}
              </p>
            </div>

            {user?.role === "ADMIN" && (
              <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Tutup Form" : "+ Tambah Tagihan"}
              </button>
            )}
          </div>

          {showForm && user?.role === "ADMIN" && (
            <form className="form-card" onSubmit={tambahLayanan}>
              <h3>Tambah Layanan PKB</h3>

              <label>Kendaraan</label>
              <select
                value={kendaraanId}
                onChange={(e) => setKendaraanId(e.target.value)}
              >
                <option value="">Pilih Kendaraan</option>
                {listKendaraan.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.platNomor} - {item.merek} -{" "}
                    {item.pengguna?.nama || "Pemilik"}
                  </option>
                ))}
              </select>

              <label>Tahun Pajak</label>
              <input
                type="number"
                placeholder="Contoh: 2026"
                value={tahunPajak}
                onChange={(e) => setTahunPajak(e.target.value)}
              />

              <label>Nominal Tagihan</label>
              <input
                type="number"
                placeholder="Contoh: 350000"
                value={nominalTagihan}
                onChange={(e) => setNominalTagihan(e.target.value)}
              />

              <label>Status Layanan</label>
              <select
                value={statusLayanan}
                onChange={(e) => setStatusLayanan(e.target.value)}
              >
                <option value="MENUNGGU">MENUNGGU</option>
                <option value="DIPROSES">DIPROSES</option>
                <option value="SELESAI">SELESAI</option>
                <option value="LUNAS">LUNAS</option>
              </select>

              <button type="submit">Simpan Tagihan</button>
            </form>
          )}

          {loading ? (
            <div className="summary-card">
              <p>Loading data layanan PKB...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Plat Nomor</th>
                  <th>Merek</th>
                  <th>Pemilik</th>
                  <th>Tahun Pajak</th>
                  <th>Nominal Tagihan</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredLayanan.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      {user?.role === "ADMIN"
                        ? "Belum ada data layanan PKB."
                        : "Belum ada tagihan PKB untuk akun Anda."}
                    </td>
                  </tr>
                ) : (
                  filteredLayanan.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.kendaraan?.platNomor || "-"}</td>
                      <td>{item.kendaraan?.merek || "-"}</td>
                      <td>{item.kendaraan?.pengguna?.nama || "-"}</td>
                      <td>{item.tahunPajak || "-"}</td>
                      <td>{formatRupiah(item.nominalTagihan)}</td>
                      <td>
                        <span
                          className={
                            item.statusLayanan === "SELESAI" ||
                            item.statusLayanan === "LUNAS"
                              ? "status-success"
                              : "status-warning"
                          }
                        >
                          {item.statusLayanan || "-"}
                        </span>
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

export default TagihanPage;