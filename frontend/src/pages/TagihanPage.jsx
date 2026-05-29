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
  const [selectedBukti, setSelectedBukti] = useState(null);

  const [kendaraanId, setKendaraanId] = useState("");
  const [tahunPajak, setTahunPajak] = useState("");
  const [nominalTagihan, setNominalTagihan] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState("");
  const [statusLayanan, setStatusLayanan] = useState("MENUNGGU");

  useEffect(() => {
    getLayanan();

    if (user?.role === "ADMIN") {
      getKendaraan();
    }
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
      alert("Gagal mengambil data tagihan dari backend");
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
      alert("Gagal mengambil data kendaraan untuk pilihan tagihan");
    }
  };

  const tambahTagihan = async (e) => {
    e.preventDefault();

    if (!kendaraanId || !tahunPajak || !nominalTagihan || !statusLayanan) {
      alert("Kendaraan, tahun pajak, nominal, dan status wajib diisi");
      return;
    }

    const dataTagihan = {
      tahunPajak: Number(tahunPajak),
      nominalTagihan: Number(nominalTagihan),
      jatuhTempo: jatuhTempo || null,
      denda: 0,
      statusLayanan,
      kendaraan: {
        id: Number(kendaraanId),
      },
    };

    try {
      await api.post("/layanan", dataTagihan);

      alert("Tagihan pajak berhasil ditambahkan");

      setKendaraanId("");
      setTahunPajak("");
      setNominalTagihan("");
      setJatuhTempo("");
      setStatusLayanan("MENUNGGU");
      setShowForm(false);

      getLayanan();
    } catch (error) {
      console.error("Gagal tambah tagihan:", error);
      alert("Gagal menambahkan tagihan. Cek backend atau console.");
    }
  };

  const bayarPajak = async (id) => {
    const konfirmasi = confirm(
      "Yakin ingin membayar tagihan pajak ini? Status akan berubah menjadi LUNAS."
    );

    if (!konfirmasi) return;

    try {
      await api.put(`/layanan/${id}/bayar`, {
        metodePembayaran: "TRANSFER",
      });

      alert("Pembayaran berhasil. Status tagihan menjadi LUNAS.");
      getLayanan();
    } catch (error) {
      console.error("Gagal bayar pajak:", error);
      alert("Pembayaran gagal. Tagihan mungkin sudah lunas atau backend error.");
    }
  };

  const formatRupiah = (angka) => {
    return `Rp ${Number(angka || 0).toLocaleString("id-ID")}`;
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatTanggalPendek = (tanggal) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID", {
      dateStyle: "medium",
    });
  };

  const isTerlambat = (item) => {
    if (!item.jatuhTempo) return false;
    if (String(item.statusLayanan).toUpperCase() === "LUNAS") return false;

    const hariIni = new Date();
    const tanggalJatuhTempo = new Date(item.jatuhTempo);

    hariIni.setHours(0, 0, 0, 0);
    tanggalJatuhTempo.setHours(0, 0, 0, 0);

    return hariIni > tanggalJatuhTempo;
  };

  const hitungDenda = (item) => {
    const status = String(item.statusLayanan || "").toUpperCase();

    // Kalau sudah LUNAS, pakai denda yang tersimpan di database
    if (status === "LUNAS") {
      return Number(item.denda || 0);
    }

    if (!item.jatuhTempo) return 0;

    const hariIni = new Date();
    const tanggalJatuhTempo = new Date(item.jatuhTempo);

    hariIni.setHours(0, 0, 0, 0);
    tanggalJatuhTempo.setHours(0, 0, 0, 0);

    if (hariIni <= tanggalJatuhTempo) {
      return 0;
    }

    const selisihHari = Math.ceil(
      (hariIni - tanggalJatuhTempo) / (1000 * 60 * 60 * 24)
    );

    const bulanTelat = Math.ceil(selisihHari / 30);

    return bulanTelat * 50000;
  };

  const hitungTotalBayar = (item) => {
    return Number(item.nominalTagihan || 0) + hitungDenda(item);
  };

  const buatNomorTransaksi = (item) => {
    const id = String(item?.id || 0).padStart(4, "0");
    const tahun = item?.tahunPajak || new Date().getFullYear();
    return `TRX-SAMSAT-${tahun}-${id}`;
  };

  const cetakBukti = () => {
    window.print();
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
              <h1>{user?.role === "ADMIN" ? "Tagihan Pajak" : "Tagihan Saya"}</h1>
              <p>
                {user?.role === "ADMIN"
                  ? "Kelola data tagihan pajak kendaraan masyarakat."
                  : "Lihat, bayar, dan cetak bukti pembayaran pajak kendaraan Anda."}
              </p>
            </div>

            {user?.role === "ADMIN" && (
              <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Tutup Form" : "+ Tambah Tagihan"}
              </button>
            )}
          </div>

          {showForm && user?.role === "ADMIN" && (
            <form className="form-card" onSubmit={tambahTagihan}>
              <h3>Tambah Tagihan Pajak</h3>

              <label>Kendaraan</label>
              <select
                value={kendaraanId}
                onChange={(e) => setKendaraanId(e.target.value)}
              >
                <option value="">Pilih kendaraan</option>
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

              <label>Jatuh Tempo</label>
              <input
                type="date"
                value={jatuhTempo}
                onChange={(e) => setJatuhTempo(e.target.value)}
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
              <p>Loading data tagihan pajak...</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Plat Nomor</th>
                    <th>Merek</th>
                    <th>Pemilik</th>
                    <th>Tahun Pajak</th>
                    <th>Nominal</th>
                    <th>Jatuh Tempo</th>
                    <th>Denda</th>
                    <th>Total Bayar</th>
                    <th>Status</th>
                    <th>Metode</th>
                    <th>Tanggal Bayar</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLayanan.length === 0 ? (
                    <tr>
                      <td colSpan="13">
                        {user?.role === "ADMIN"
                          ? "Belum ada data tagihan pajak."
                          : "Belum ada tagihan pajak untuk akun Anda."}
                      </td>
                    </tr>
                  ) : (
                    filteredLayanan.map((item, index) => {
                      const status = String(item.statusLayanan || "").toUpperCase();
                      const terlambat = isTerlambat(item);

                      return (
                        <tr key={item.id || index}>
                          <td>{index + 1}</td>
                          <td>{item.kendaraan?.platNomor || "-"}</td>
                          <td>{item.kendaraan?.merek || "-"}</td>
                          <td>{item.kendaraan?.pengguna?.nama || "-"}</td>
                          <td>{item.tahunPajak || "-"}</td>
                          <td>{formatRupiah(item.nominalTagihan)}</td>
                          <td>{formatTanggalPendek(item.jatuhTempo)}</td>
                          <td>{formatRupiah(hitungDenda(item))}</td>
                          <td>{formatRupiah(hitungTotalBayar(item))}</td>

                          <td>
                            <span
                              className={
                                status === "LUNAS" || status === "SELESAI"
                                  ? "status-success"
                                  : terlambat
                                  ? "status-danger"
                                  : "status-warning"
                              }
                            >
                              {status === "LUNAS"
                                ? "LUNAS"
                                : terlambat
                                ? "TERLAMBAT"
                                : item.statusLayanan || "-"}
                            </span>
                          </td>

                          <td>{item.metodePembayaran || "-"}</td>
                          <td>{formatTanggal(item.tanggalBayar)}</td>

                          <td>
                            {user?.role === "MASYARAKAT" && status !== "LUNAS" ? (
                              <button onClick={() => bayarPajak(item.id)}>
                                Bayar
                              </button>
                            ) : status === "LUNAS" ? (
                              <button onClick={() => setSelectedBukti(item)}>
                                Cetak Bukti
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {selectedBukti && (
            <div className="receipt-overlay">
              <div className="receipt-modal">
                <div className="receipt-topbar no-print">
                  <h3>Bukti Pembayaran</h3>

                  <button
                    type="button"
                    className="receipt-close"
                    onClick={() => setSelectedBukti(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="receipt-paper" id="bukti-pembayaran">
                  <div className="receipt-header">
                    <h2>SAMSAT DIGITAL</h2>
                    <p>Bukti Pembayaran Pajak Kendaraan Bermotor</p>
                  </div>

                  <div className="receipt-status">LUNAS</div>

                  <div className="receipt-info">
                    <div>
                      <span>No. Transaksi</span>
                      <strong>{buatNomorTransaksi(selectedBukti)}</strong>
                    </div>

                    <div>
                      <span>Tanggal Bayar</span>
                      <strong>{formatTanggal(selectedBukti.tanggalBayar)}</strong>
                    </div>
                  </div>

                  <div className="receipt-detail">
                    <div>
                      <span>Nama Pemilik</span>
                      <p>{selectedBukti.kendaraan?.pengguna?.nama || "-"}</p>
                    </div>

                    <div>
                      <span>NIK</span>
                      <p>{selectedBukti.kendaraan?.pengguna?.nik || "-"}</p>
                    </div>

                    <div>
                      <span>Email</span>
                      <p>{selectedBukti.kendaraan?.pengguna?.email || "-"}</p>
                    </div>

                    <div>
                      <span>Plat Nomor</span>
                      <p>{selectedBukti.kendaraan?.platNomor || "-"}</p>
                    </div>

                    <div>
                      <span>Merek Kendaraan</span>
                      <p>{selectedBukti.kendaraan?.merek || "-"}</p>
                    </div>

                    <div>
                      <span>Tahun Pajak</span>
                      <p>{selectedBukti.tahunPajak || "-"}</p>
                    </div>

                    <div>
                      <span>Jatuh Tempo</span>
                      <p>{formatTanggalPendek(selectedBukti.jatuhTempo)}</p>
                    </div>

                    <div>
                      <span>Denda</span>
                      <p>{formatRupiah(hitungDenda(selectedBukti))}</p>
                    </div>

                    <div>
                      <span>Metode Pembayaran</span>
                      <p>{selectedBukti.metodePembayaran || "TRANSFER"}</p>
                    </div>

                    <div>
                      <span>Status</span>
                      <p>{selectedBukti.statusLayanan || "LUNAS"}</p>
                    </div>
                  </div>

                  <div className="receipt-total">
                    <span>Total Pembayaran</span>
                    <strong>{formatRupiah(hitungTotalBayar(selectedBukti))}</strong>
                  </div>

                  <div className="receipt-footer">
                    <p>
                      Bukti ini sah sebagai tanda pembayaran pajak kendaraan
                      bermotor melalui sistem SAMSAT Digital.
                    </p>
                    <p>Terima kasih telah melakukan pembayaran tepat waktu.</p>
                  </div>
                </div>

                <div className="receipt-actions no-print">
                  <button type="button" onClick={cetakBukti}>
                    Cetak / Simpan PDF
                  </button>

                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => setSelectedBukti(null)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default TagihanPage;