import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { tagihan } from "../data/dummyData";

function LaporanPage() {
  const totalTagihan = tagihan.reduce((total, item) => total + item.jumlah, 0);
  const sudahBayar = tagihan.filter((item) => item.status === "Sudah Bayar");
  const belumBayar = tagihan.filter((item) => item.status === "Belum Bayar");

  return (
    <div>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <h1>Laporan Pajak</h1>
          <p>Ringkasan data pajak kendaraan.</p>

          <div className="card-grid">
            <div className="card">
              <h3>Total Nominal Tagihan</h3>
              <h2>Rp {totalTagihan.toLocaleString("id-ID")}</h2>
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
        </main>
      </div>
    </div>
  );
}

export default LaporanPage;