import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileText,
  Landmark,
  Plus,
  QrCode,
  RefreshCw,
  Receipt,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BuktiPembayaranModal from "../components/BuktiPembayaranModal";
import api from "../services/api";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatTanggal = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTanggalWaktu = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function TagihanPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  const [listTagihan, setListTagihan] = useState([]);
  const [listKendaraan, setListKendaraan] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedBukti, setSelectedBukti] = useState(null);

  const [selectedTagihanBayar, setSelectedTagihanBayar] = useState(null);
  const [metodePembayaran, setMetodePembayaran] = useState("TRANSFER");
  const [prosesBayar, setProsesBayar] = useState(false);

  const [kendaraanId, setKendaraanId] = useState("");
  const [tahunPajak, setTahunPajak] = useState("");
  const [nominalTagihan, setNominalTagihan] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState("");
  const [statusLayanan, setStatusLayanan] = useState("MENUNGGU");

  useEffect(() => {
    getData();
  }, []);

  const isLunas = (item) => {
    return String(item?.statusLayanan || "").toUpperCase() === "LUNAS";
  };

  const hitungDenda = (item) => {
    if (isLunas(item)) {
      return Number(item.denda || 0);
    }

    if (!item?.jatuhTempo) {
      return 0;
    }

    const hariIni = new Date();
    const tanggalJatuhTempo = new Date(item.jatuhTempo);

    hariIni.setHours(0, 0, 0, 0);
    tanggalJatuhTempo.setHours(0, 0, 0, 0);

    if (hariIni <= tanggalJatuhTempo) {
      return 0;
    }

    const selisihHari = Math.ceil(
      (hariIni.getTime() - tanggalJatuhTempo.getTime()) / DAY_IN_MS
    );

    const bulanTelat = Math.ceil(selisihHari / 30);

    return bulanTelat * 50000;
  };

  const getStatusTampilan = (item) => {
    if (isLunas(item)) {
      return "LUNAS";
    }

    if (hitungDenda(item) > 0) {
      return "TERLAMBAT";
    }

    return "MENUNGGU";
  };

  const getDeadlineText = (item) => {
    if (!item?.jatuhTempo) {
      return "-";
    }

    if (isLunas(item)) {
      return formatTanggal(item.jatuhTempo);
    }

    const hariIni = new Date();
    const tanggalJatuhTempo = new Date(item.jatuhTempo);

    hariIni.setHours(0, 0, 0, 0);
    tanggalJatuhTempo.setHours(0, 0, 0, 0);

    const selisihHari = Math.ceil(
      (tanggalJatuhTempo.getTime() - hariIni.getTime()) / DAY_IN_MS
    );

    if (selisihHari < 0) {
      return `${Math.abs(selisihHari)} hari terlambat`;
    }

    if (selisihHari === 0) {
      return "Jatuh tempo hari ini";
    }

    if (selisihHari <= 30) {
      return `${selisihHari} hari lagi`;
    }

    return formatTanggal(item.jatuhTempo);
  };

  const getTagihan = async () => {
    const response = await api.get("/layanan");

    const data = Array.isArray(response.data) ? response.data : [];

    if (isAdmin) {
      setListTagihan(data);
      return;
    }

    const tagihanMilikUser = data.filter((item) => {
      return item.kendaraan?.pengguna?.nik === user?.nik;
    });

    setListTagihan(tagihanMilikUser);
  };

  const getKendaraan = async () => {
    if (!isAdmin) {
      return;
    }

    const response = await api.get("/kendaraan");

    setListKendaraan(
      Array.isArray(response.data) ? response.data : []
    );
  };

  const getData = async () => {
    try {
      setLoading(true);

      await Promise.all([getTagihan(), getKendaraan()]);
    } catch (error) {
      console.error("Gagal mengambil data tagihan:", error);
      alert("Gagal mengambil data tagihan dari backend.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    getData();
  };

  const resetForm = () => {
    setKendaraanId("");
    setTahunPajak("");
    setNominalTagihan("");
    setJatuhTempo("");
    setStatusLayanan("MENUNGGU");
  };

  const handleTambahTagihan = async (event) => {
    event.preventDefault();

    if (!kendaraanId || !tahunPajak || !nominalTagihan || !jatuhTempo) {
      alert("Kendaraan, tahun pajak, nominal, dan jatuh tempo wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        kendaraan: {
          id: Number(kendaraanId),
        },
        tahunPajak: Number(tahunPajak),
        nominalTagihan: Number(nominalTagihan),
        jatuhTempo,
        statusLayanan,
        denda: 0,
      };

      await api.post("/layanan", payload);

      alert("Tagihan pajak berhasil ditambahkan.");

      resetForm();
      setShowForm(false);

      await getData();
    } catch (error) {
      console.error("Gagal menambah tagihan:", error);
      alert(
        error?.response?.data?.pesan ||
          "Gagal menambahkan tagihan pajak."
      );
    } finally {
      setSaving(false);
    }
  };

const bukaModalBayar = (item) => {
  setSelectedTagihanBayar(item);
  setMetodePembayaran("TRANSFER");
};

const tutupModalBayar = () => {
  if (prosesBayar) {
    return;
  }

  setSelectedTagihanBayar(null);
  setMetodePembayaran("TRANSFER");
};

const handleBayar = async () => {
  if (!selectedTagihanBayar) {
    return;
  }

  try {
    setProsesBayar(true);

    await api.put(`/layanan/${selectedTagihanBayar.id}/bayar`, {
      metodePembayaran,
    });

    alert(
      `Pembayaran berhasil menggunakan ${
        metodePembayaran === "QRIS" ? "QRIS" : "Transfer Bank"
      }. Status tagihan sekarang LUNAS.`
    );

    setSelectedTagihanBayar(null);
    setMetodePembayaran("TRANSFER");

    await getData();
  } catch (error) {
    console.error("Gagal membayar tagihan:", error);

    alert(
      error?.response?.data?.pesan ||
        "Gagal melakukan pembayaran pajak."
    );
  } finally {
    setProsesBayar(false);
  }
};

  const stats = useMemo(() => {
    const lunas = listTagihan.filter((item) => isLunas(item));

    const belumLunas = listTagihan.filter((item) => !isLunas(item));

    const terlambat = listTagihan.filter((item) => {
      return !isLunas(item) && hitungDenda(item) > 0;
    });

    const totalBelumDibayar = belumLunas.reduce((total, item) => {
      return (
        total +
        Number(item.nominalTagihan || 0) +
        Number(hitungDenda(item) || 0)
      );
    }, 0);

    return {
      lunas: lunas.length,
      belumLunas: belumLunas.length,
      terlambat: terlambat.length,
      totalBelumDibayar,
    };
  }, [listTagihan]);

  return (
    <div className="premium-shell">
      <Navbar />

      <div className="layout premium-layout">
        <Sidebar />

        <main className="content premium-content tagihan-page">
          <section className="page-header">
            <div>
              <span className="page-header-label">
                {isAdmin ? "Tax Management" : "Citizen Payment"}
              </span>

              <h1>{isAdmin ? "Kelola Tagihan Pajak" : "Tagihan Saya"}</h1>

              <p>
                {isAdmin
                  ? "Buat dan pantau tagihan Pajak Kendaraan Bermotor setiap masyarakat."
                  : "Lihat jatuh tempo, denda, pembayaran, dan bukti pajak kendaraan Anda."}
              </p>
            </div>

            <div className="tagihan-header-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={refreshData}
                disabled={refreshing}
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "tagihan-spin" : ""}
                />

                Refresh
              </button>

              {isAdmin && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? <X size={17} /> : <Plus size={17} />}

                  {showForm ? "Tutup Form" : "Tambah Tagihan"}
                </button>
              )}
            </div>
          </section>

          <section className="tagihan-summary-grid">
            <div className="tagihan-summary-card blue">
              <div className="tagihan-summary-icon">
                <Receipt size={21} />
              </div>

              <span>Total Tagihan</span>
              <h3>{listTagihan.length}</h3>
              <p>Seluruh data pajak kendaraan</p>
            </div>

            <div className="tagihan-summary-card orange">
              <div className="tagihan-summary-icon">
                <CreditCard size={21} />
              </div>

              <span>Belum Lunas</span>
              <h3>{stats.belumLunas}</h3>
              <p>Masih menunggu pembayaran</p>
            </div>

            <div className="tagihan-summary-card green">
              <div className="tagihan-summary-icon">
                <CheckCircle2 size={21} />
              </div>

              <span>Sudah Lunas</span>
              <h3>{stats.lunas}</h3>
              <p>Pembayaran telah diselesaikan</p>
            </div>

            <div className="tagihan-summary-card red">
              <div className="tagihan-summary-icon">
                <AlertTriangle size={21} />
              </div>

              <span>Terlambat</span>
              <h3>{stats.terlambat}</h3>

              <p>
                {isAdmin
                  ? "Tagihan melewati jatuh tempo"
                  : formatRupiah(stats.totalBelumDibayar)}
              </p>
            </div>
          </section>

          {isAdmin && showForm && (
            <section className="form-card tagihan-form-card">
              <div className="tagihan-form-heading">
                <div>
                  <span>Form Tagihan</span>
                  <h2>Tambah Tagihan Pajak Kendaraan</h2>

                  <p>
                    Admin menentukan kendaraan, nominal pajak, tahun pajak,
                    dan tanggal jatuh tempo.
                  </p>
                </div>

                <CalendarClock size={28} />
              </div>

              <form
                className="tagihan-form-grid"
                onSubmit={handleTambahTagihan}
              >
                <label>
                  <span>Kendaraan dan Pemilik</span>

                  <select
                    value={kendaraanId}
                    onChange={(event) =>
                      setKendaraanId(event.target.value)
                    }
                  >
                    <option value="">Pilih kendaraan</option>

                    {listKendaraan.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.platNomor} - {item.merek} -{" "}
                        {item.pengguna?.nama || "Tanpa pemilik"}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Tahun Pajak</span>

                  <input
                    type="number"
                    placeholder="Contoh: 2026"
                    value={tahunPajak}
                    onChange={(event) =>
                      setTahunPajak(event.target.value)
                    }
                  />
                </label>

                <label>
                  <span>Nominal Tagihan</span>

                  <input
                    type="number"
                    placeholder="Contoh: 350000"
                    value={nominalTagihan}
                    onChange={(event) =>
                      setNominalTagihan(event.target.value)
                    }
                  />
                </label>

                <label>
                  <span>Jatuh Tempo</span>

                  <input
                    type="date"
                    value={jatuhTempo}
                    onChange={(event) =>
                      setJatuhTempo(event.target.value)
                    }
                  />
                </label>

                <label>
                  <span>Status Awal</span>

                  <select
                    value={statusLayanan}
                    onChange={(event) =>
                      setStatusLayanan(event.target.value)
                    }
                  >
                    <option value="MENUNGGU">MENUNGGU</option>
                    <option value="LUNAS">LUNAS</option>
                  </select>
                </label>

                <div className="tagihan-form-submit">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={saving}
                  >
                    <FileText size={17} />

                    {saving ? "Menyimpan..." : "Simpan Tagihan"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="tagihan-table-card">
            <div className="tagihan-table-heading">
              <div>
                <span>Vehicle Tax Records</span>
                <h2>Data Tagihan Pajak</h2>
              </div>

              <div className="tagihan-total-badge">
                {listTagihan.length} Data
              </div>
            </div>

            {loading ? (
              <div className="tagihan-loading">
                <RefreshCw size={20} className="tagihan-spin" />
                Memuat data tagihan...
              </div>
            ) : (
              <div className="tagihan-table-wrap">
                <table
                  className={`tagihan-table ${
                    isAdmin ? "tagihan-table-admin" : "tagihan-table-user"
                  }`}
                >
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Kendaraan</th>

                      {isAdmin && <th>Pemilik</th>}

                      <th>Tahun Pajak</th>
                      <th>Nominal</th>
                      <th>Jatuh Tempo</th>
                      <th>Denda</th>
                      <th>Total Bayar</th>
                      <th>Status</th>
                      <th>Tanggal Bayar</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {listTagihan.length === 0 ? (
                      <tr>
                        <td colSpan={isAdmin ? "11" : "10"}>
                          Belum ada data tagihan pajak.
                        </td>
                      </tr>
                    ) : (
                      listTagihan.map((item, index) => {
                        const denda = hitungDenda(item);

                        const totalBayar =
                          Number(item.nominalTagihan || 0) + denda;

                        const status = getStatusTampilan(item);

                        return (
                          <tr key={item.id || index}>
                            <td>{index + 1}</td>

                            <td>
                              <div className="tagihan-vehicle-cell">
                                <strong>
                                  {item.kendaraan?.platNomor || "-"}
                                </strong>

                                <span>
                                  {item.kendaraan?.merek || "-"}
                                </span>
                              </div>
                            </td>

                            {isAdmin && (
                              <td>
                                <div className="tagihan-owner-cell">
                                  <strong>
                                    {item.kendaraan?.pengguna?.nama ||
                                      "-"}
                                  </strong>

                                  <span>
                                    {item.kendaraan?.pengguna?.nik ||
                                      "-"}
                                  </span>
                                </div>
                              </td>
                            )}

                            <td>{item.tahunPajak || "-"}</td>

                            <td>
                              {formatRupiah(item.nominalTagihan)}
                            </td>

                            <td>
                              <div className="tagihan-deadline-cell">
                                <strong>
                                  {formatTanggal(item.jatuhTempo)}
                                </strong>

                                <span>{getDeadlineText(item)}</span>
                              </div>
                            </td>

                            <td>{formatRupiah(denda)}</td>

                            <td>
                              <strong>{formatRupiah(totalBayar)}</strong>
                            </td>

                            <td>
                              <span
                                className={`tagihan-status-badge ${status.toLowerCase()}`}
                              >
                                {status}
                              </span>
                            </td>

                            <td>
                              {formatTanggalWaktu(item.tanggalBayar)}
                            </td>

                            <td>
                              {isLunas(item) ? (
                                <button
                                  type="button"
                                  className="btn-primary tagihan-action-btn"
                                  onClick={() => setSelectedBukti(item)}
                                >
                                  <Receipt size={16} />
                                  Cetak Bukti
                                </button>
                              ) : isAdmin ? (
                                <span className="tagihan-admin-waiting">
                                  Menunggu Bayar
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-primary tagihan-action-btn"
                                  onClick={() => bukaModalBayar(item)}
                                >
                                  <CreditCard size={16} />
                                  Bayar
                                </button>
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
          </section>
        </main>
      </div>

      {selectedTagihanBayar && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <div>
                <span>Pembayaran Pajak Kendaraan</span>
                <h2>Pilih Metode Pembayaran</h2>
                <p>
                  Pilih metode pembayaran untuk menyelesaikan tagihan kendaraan.
                </p>
              </div>

              <button
                type="button"
                className="payment-modal-close"
                onClick={tutupModalBayar}
                disabled={prosesBayar}
                aria-label="Tutup modal pembayaran"
              >
                <X size={20} />
              </button>
            </div>

            <div className="payment-modal-summary">
              <div>
                <span>Kendaraan</span>
                <strong>
                  {selectedTagihanBayar.kendaraan?.platNomor || "-"}
                </strong>
                <p>{selectedTagihanBayar.kendaraan?.merek || "-"}</p>
              </div>

              <div>
                <span>Total Pembayaran</span>
                <strong>
                  {formatRupiah(
                    Number(selectedTagihanBayar.nominalTagihan || 0) +
                      hitungDenda(selectedTagihanBayar)
                  )}
                </strong>
              </div>
            </div>

            <div className="payment-method-grid">
              <button
                type="button"
                className={`payment-method-card ${
                  metodePembayaran === "TRANSFER" ? "active" : ""
                }`}
                onClick={() => setMetodePembayaran("TRANSFER")}
              >
                <Landmark size={25} />

                <div>
                  <strong>Transfer Bank</strong>
                  <span>Gunakan virtual account dummy</span>
                </div>
              </button>

              <button
                type="button"
                className={`payment-method-card ${
                  metodePembayaran === "QRIS" ? "active" : ""
                }`}
                onClick={() => setMetodePembayaran("QRIS")}
              >
                <QrCode size={25} />

                <div>
                  <strong>QRIS</strong>
                  <span>Scan QRIS dummy untuk simulasi</span>
                </div>
              </button>
            </div>

            {metodePembayaran === "TRANSFER" ? (
              <div className="payment-instruction-card">
                <span>Nomor Virtual Account</span>
                <strong>8808 1234 5678 9012</strong>
                <p>
                  Nomor rekening ini hanya digunakan untuk simulasi pembayaran.
                </p>
              </div>
            ) : (
              <div className="payment-qris-card">
                <span>Scan QRIS Dummy</span>

                <img
                  src="/qris-dummy-samsat.png"
                  alt="QRIS dummy SAMSAT Digital"
                />

                <p>
                  QRIS ini hanya untuk simulasi. Tidak melakukan transaksi asli.
                </p>
              </div>
            )}

            <div className="payment-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={tutupModalBayar}
                disabled={prosesBayar}
              >
                Batal
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={handleBayar}
                disabled={prosesBayar}
              >
                <CheckCircle2 size={17} />

                {prosesBayar
                  ? "Memproses..."
                  : `Konfirmasi ${
                      metodePembayaran === "QRIS" ? "QRIS" : "Transfer"
                    }`}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBukti && (
        <BuktiPembayaranModal
          data={selectedBukti}
          onClose={() => setSelectedBukti(null)}
        />
      )}
    </div>
  );
}

export default TagihanPage;