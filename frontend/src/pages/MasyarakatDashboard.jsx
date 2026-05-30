import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  Car,
  CheckCircle2,
  CreditCard,
  FileText,
  MessageSquare,
  Receipt,
  RefreshCw,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import PremiumBackground from "../components/PremiumBackground";
import TiltCard from "../components/TiltCard";

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

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTanggalWaktu = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function MasyarakatDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [kendaraan, setKendaraan] = useState([]);
  const [layanan, setLayanan] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      setLoading(true);

      const [kendaraanRes, layananRes] = await Promise.allSettled([
        api.get(`/kendaraan/nik/${user?.nik}`),
        api.get("/layanan"),
      ]);

      if (
        kendaraanRes.status === "fulfilled" &&
        Array.isArray(kendaraanRes.value.data)
      ) {
        setKendaraan(kendaraanRes.value.data);
      }

      if (
        layananRes.status === "fulfilled" &&
        Array.isArray(layananRes.value.data)
      ) {
        const tagihanMilikUser = layananRes.value.data.filter((item) => {
          return item.kendaraan?.pengguna?.nik === user?.nik;
        });

        setLayanan(tagihanMilikUser);
      }
    } catch (error) {
      console.error("Gagal mengambil dashboard masyarakat:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshDashboard = () => {
    setRefreshing(true);
    getDashboardData();
  };

  const isLunas = (item) => {
    return String(item?.statusLayanan || "").toUpperCase() === "LUNAS";
  };

  const hitungDenda = (item) => {
    if (isLunas(item)) {
      return Number(item.denda || 0);
    }

    if (!item.jatuhTempo) {
      return 0;
    }

    const hariIni = new Date();
    const jatuhTempo = new Date(item.jatuhTempo);

    hariIni.setHours(0, 0, 0, 0);
    jatuhTempo.setHours(0, 0, 0, 0);

    if (hariIni <= jatuhTempo) {
      return 0;
    }

    const selisihHari = Math.ceil(
      (hariIni.getTime() - jatuhTempo.getTime()) / DAY_IN_MS
    );

    const bulanTelat = Math.ceil(selisihHari / 30);

    return bulanTelat * 50000;
  };

  const getDeadlineInfo = (item) => {
    if (!item.jatuhTempo) {
      return {
        text: "Belum ada jatuh tempo",
        tone: "neutral",
      };
    }

    const hariIni = new Date();
    const jatuhTempo = new Date(item.jatuhTempo);

    hariIni.setHours(0, 0, 0, 0);
    jatuhTempo.setHours(0, 0, 0, 0);

    const difference = Math.ceil(
      (jatuhTempo.getTime() - hariIni.getTime()) / DAY_IN_MS
    );

    if (difference < 0) {
      return {
        text: `${Math.abs(difference)} hari terlambat`,
        tone: "danger",
      };
    }

    if (difference === 0) {
      return {
        text: "Jatuh tempo hari ini",
        tone: "danger",
      };
    }

    if (difference <= 30) {
      return {
        text: `${difference} hari lagi`,
        tone: "warning",
      };
    }

    return {
      text: formatTanggal(item.jatuhTempo),
      tone: "neutral",
    };
  };

  const stats = useMemo(() => {
    const lunas = layanan.filter((item) => isLunas(item));

    const belumLunas = layanan.filter((item) => !isLunas(item));

    const totalDenda = layanan.reduce((total, item) => {
      return total + hitungDenda(item);
    }, 0);

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
      totalDenda,
      totalBelumDibayar,
    };
  }, [layanan]);

  const tagihanAktif = useMemo(() => {
    return layanan
      .filter((item) => !isLunas(item))
      .sort((a, b) => {
        const dateA = new Date(a.jatuhTempo || "9999-12-31").getTime();
        const dateB = new Date(b.jatuhTempo || "9999-12-31").getTime();

        return dateA - dateB;
      })
      .slice(0, 5);
  }, [layanan]);

  const pembayaranTerbaru = useMemo(() => {
    return layanan
      .filter((item) => isLunas(item))
      .sort((a, b) => {
        const dateA = new Date(a.tanggalBayar || 0).getTime();
        const dateB = new Date(b.tanggalBayar || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 4);
  }, [layanan]);

  const cards = [
    {
      title: "Kendaraan Terdaftar",
      value: kendaraan.length,
      desc: "Kendaraan atas nama Anda",
      icon: Car,
      tone: "blue",
    },
    {
      title: "Tagihan Belum Lunas",
      value: stats.belumLunas,
      desc: "Perlu segera dibayarkan",
      icon: CreditCard,
      tone: "orange",
    },
    {
      title: "Tagihan Lunas",
      value: stats.lunas,
      desc: "Pembayaran sudah selesai",
      icon: CheckCircle2,
      tone: "green",
    },
    {
      title: "Total Denda",
      value: formatRupiah(stats.totalDenda),
      desc: "Akumulasi denda keterlambatan",
      icon: AlertTriangle,
      tone: "red",
    },
  ];

  return (
    <div className="premium-shell citizen-v2-shell">
      <PremiumBackground />
      <Navbar />

      <div className="layout premium-layout">
        <Sidebar />

        <main className="content premium-content citizen-v2-content">
          <motion.section
            className="citizen-v2-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="citizen-v2-hero-copy">
              <span className="citizen-v2-eyebrow">
                <ShieldCheck size={17} />
                Citizen Tax Portal
              </span>

              <h1>Halo, {user?.nama || "Masyarakat"}</h1>

              <p>
                Kelola pajak kendaraan Anda dengan lebih praktis. Cek kendaraan,
                pantau jatuh tempo, bayar tagihan, dan simpan bukti pembayaran
                melalui SAMSAT Digital.
              </p>

              <div className="citizen-v2-hero-actions">
                <Link to="/masyarakat/tagihan">
                  Cek Tagihan
                  <ArrowUpRight size={17} />
                </Link>

                <button
                  type="button"
                  onClick={refreshDashboard}
                  disabled={refreshing}
                >
                  <RefreshCw
                    size={17}
                    className={refreshing ? "citizen-v2-spin" : ""}
                  />
                  Refresh Data
                </button>
              </div>
            </div>

            <TiltCard className="citizen-v2-profile-card">
              <div className="citizen-v2-profile-head">
                <div className="citizen-v2-profile-avatar">
                  <UserRound size={28} />
                </div>

                <span>AKUN AKTIF</span>
              </div>

              <h3>{user?.nama || "Masyarakat"}</h3>
              <p>{user?.email || "-"}</p>

              <div className="citizen-v2-profile-info">
                <span>NIK</span>
                <strong>{user?.nik || "-"}</strong>
              </div>
            </TiltCard>
          </motion.section>

          {loading ? (
            <div className="citizen-v2-loading">
              <RefreshCw size={22} className="citizen-v2-spin" />
              Memuat dashboard masyarakat...
            </div>
          ) : (
            <>
              <section className="citizen-v2-kpi-grid">
                {cards.map((card, index) => {
                  const Icon = card.icon;

                  return (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                    >
                      <TiltCard
                        className={`citizen-v2-kpi-card ${card.tone}`}
                      >
                        <div className="citizen-v2-kpi-icon">
                          <Icon size={22} />
                        </div>

                        <p>{card.title}</p>
                        <h2>{card.value}</h2>
                        <span>{card.desc}</span>
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </section>

              <section className="citizen-v2-main-grid">
                <div className="citizen-v2-panel citizen-v2-bill-panel">
                  <div className="citizen-v2-panel-head">
                    <div>
                      <span>Tagihan Pajak</span>
                      <h3>Tagihan Aktif</h3>
                      <p>Tagihan yang belum dibayar dan perlu diperhatikan.</p>
                    </div>

                    <Link to="/masyarakat/tagihan">Lihat Semua</Link>
                  </div>

                  <div className="citizen-v2-bill-summary">
                    <div>
                      <span>Total yang Perlu Dibayar</span>
                      <strong>{formatRupiah(stats.totalBelumDibayar)}</strong>
                    </div>

                    <WalletCards size={28} />
                  </div>

                  <div className="citizen-v2-bill-list">
                    {tagihanAktif.length === 0 ? (
                      <div className="citizen-v2-empty">
                        <CheckCircle2 size={22} />
                        Semua tagihan sudah lunas.
                      </div>
                    ) : (
                      tagihanAktif.map((item) => {
                        const deadline = getDeadlineInfo(item);
                        const denda = hitungDenda(item);

                        return (
                          <div className="citizen-v2-bill-item" key={item.id}>
                            <div className="citizen-v2-bill-icon">
                              <CalendarClock size={18} />
                            </div>

                            <div>
                              <strong>
                                {item.kendaraan?.platNomor || "-"}
                              </strong>

                              <span>
                                {item.kendaraan?.merek || "Kendaraan"}
                              </span>
                            </div>

                            <div className="citizen-v2-bill-meta">
                              <strong>
                                {formatRupiah(
                                  Number(item.nominalTagihan || 0) + denda
                                )}
                              </strong>

                              <span className={deadline.tone}>
                                {deadline.text}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="citizen-v2-panel citizen-v2-account-panel">
                  <div className="citizen-v2-panel-head">
                    <div>
                      <span>Informasi Akun</span>
                      <h3>Data Masyarakat</h3>
                      <p>Identitas akun yang terdaftar pada sistem.</p>
                    </div>
                  </div>

                  <div className="citizen-v2-account-list">
                    <div>
                      <span>Nama Lengkap</span>
                      <strong>{user?.nama || "-"}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{user?.email || "-"}</strong>
                    </div>

                    <div>
                      <span>NIK</span>
                      <strong>{user?.nik || "-"}</strong>
                    </div>

                    <div>
                      <span>Status Akun</span>
                      <strong className="citizen-v2-active-status">
                        Terverifikasi
                      </strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="citizen-v2-panel citizen-v2-history-panel">
                <div className="citizen-v2-panel-head">
                  <div>
                    <span>Riwayat Pembayaran</span>
                    <h3>Transaksi Terbaru</h3>
                    <p>Pembayaran pajak kendaraan yang sudah selesai.</p>
                  </div>

                  <Link to="/masyarakat/tagihan">Buka Tagihan</Link>
                </div>

                <div className="citizen-v2-history-grid">
                  {pembayaranTerbaru.length === 0 ? (
                    <div className="citizen-v2-empty">
                      <Receipt size={22} />
                      Belum ada transaksi pembayaran.
                    </div>
                  ) : (
                    pembayaranTerbaru.map((item) => (
                      <div className="citizen-v2-history-item" key={item.id}>
                        <div className="citizen-v2-history-icon">
                          <Receipt size={18} />
                        </div>

                        <div>
                          <strong>
                            {item.kendaraan?.platNomor || "-"}
                          </strong>

                          <span>
                            Pajak tahun {item.tahunPajak || "-"}
                          </span>
                        </div>

                        <div className="citizen-v2-history-meta">
                          <strong>
                            {formatRupiah(
                              Number(item.nominalTagihan || 0) +
                                Number(item.denda || 0)
                            )}
                          </strong>

                          <span>{formatTanggalWaktu(item.tanggalBayar)}</span>
                        </div>

                        <span className="citizen-v2-paid-badge">LUNAS</span>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="citizen-v2-quick-grid">
                <Link to="/masyarakat/kendaraan">
                  <Car size={22} />

                  <div>
                    <h3>Kendaraan Saya</h3>
                    <p>Lihat kendaraan yang terdaftar.</p>
                  </div>

                  <ArrowUpRight size={18} />
                </Link>

                <Link to="/masyarakat/tagihan">
                  <CreditCard size={22} />

                  <div>
                    <h3>Tagihan & Bayar</h3>
                    <p>Cek tagihan dan lakukan pembayaran.</p>
                  </div>

                  <ArrowUpRight size={18} />
                </Link>

                <Link to="/masyarakat/pengaduan">
                  <MessageSquare size={22} />

                  <div>
                    <h3>Pengaduan Saya</h3>
                    <p>Kirim dan pantau pengaduan.</p>
                  </div>

                  <ArrowUpRight size={18} />
                </Link>

                <Link to="/masyarakat/tagihan">
                  <FileText size={22} />

                  <div>
                    <h3>Bukti Pembayaran</h3>
                    <p>Cetak atau simpan bukti bayar PDF.</p>
                  </div>

                  <ArrowUpRight size={18} />
                </Link>
              </section>

              <section className="citizen-v2-flow-card">
                <div className="citizen-v2-flow-title">
                  <span>Alur Pembayaran</span>
                  <h2>Bayar Pajak Kendaraan dalam 3 Langkah</h2>
                </div>

                <div className="citizen-v2-flow-grid">
                  <div>
                    <span>01</span>
                    <h3>Cek Tagihan</h3>
                    <p>Lihat nominal pajak, denda, dan tanggal jatuh tempo.</p>
                  </div>

                  <div>
                    <span>02</span>
                    <h3>Bayar Pajak</h3>
                    <p>Klik tombol bayar untuk mengubah status menjadi lunas.</p>
                  </div>

                  <div>
                    <span>03</span>
                    <h3>Cetak Bukti</h3>
                    <p>Simpan bukti pembayaran sebagai PDF untuk arsip.</p>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default MasyarakatDashboard;