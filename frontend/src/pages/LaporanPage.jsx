import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function LaporanPage() {
  const [listLayanan, setListLayanan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLaporan();
  }, []);

  const getLaporan = async () => {
    try {
      const response = await api.get("/layanan");

      if (Array.isArray(response.data)) {
        setListLayanan(response.data);
      } else {
        setListLayanan([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
      alert("Gagal mengambil data laporan dari backend");
    } finally {
      setLoading(false);
    }
  };

  const totalTagihan = listLayanan.reduce(
    (total, item) => total + Number(item.nominalTagihan || 0),
    0
  );

  const sudahBayar = listLayanan.filter(
    (item) => item.statusLayanan === "LUNAS" || item.statusLayanan === "SELESAI"
  );

  const belumBayar = listLayanan.filter(
    (item) => item.statusLayanan !== "LUNAS" && item.statusLayanan !== "SELESAI"
  );

  const formatRupiah = (angka) => {
    return `Rp ${Number(angka || 0).toLocaleString("id-ID")}`;
  };

  return (
    <div>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <h1>Laporan Pajak</h1>
          <p>Ringkasan data pajak kendaraan dari database MySQL.</p>

          {loading ? (
            <div className="summary-card">
              <p>Loading data laporan...</p>
            </div>
          ) : (
            <>
              <div className="card-grid">
                <div className="card">
                  <h3>Total Nominal Tagihan</h3>
                  <h2>{formatRupiah(totalTagihan)}</h2>
                </div>

                <div className="card">
                  <h3>Sudah Bayar</h3>
                  <h2>{sudahBayar.length}</h2>
                </div>

                <div className="card">
                  <h3>Belum Bayar</h3>
                  <h2>{belumBayar.length}</h2>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Plat Nomor</th>
                    <th>Pemilik</th>
                    <th>Tahun Pajak</th>
                    <th>Nominal</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {listLayanan.length === 0 ? (
                    <tr>
                      <td colSpan="6">Belum ada data laporan pajak.</td>
                    </tr>
                  ) : (
                    listLayanan.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.kendaraan?.platNomor || "-"}</td>
                        <td>{item.kendaraan?.pengguna?.nama || "-"}</td>
                        <td>{item.tahunPajak || "-"}</td>
                        <td>{formatRupiah(item.nominalTagihan)}</td>
                        <td>{item.statusLayanan || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default LaporanPage;