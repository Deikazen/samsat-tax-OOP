import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  Car,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileText,
  MessageSquare,
  RefreshCw,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import PremiumBackground from "../components/PremiumBackground";
import TiltCard from "../components/TiltCard";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  return date;
};

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatCompactRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
};

const formatTanggal = (value) => {
  const date = parseDate(value);

  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTanggalWaktu = (value) => {
  const date = parseDate(value);

  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getMonthKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [layanan, setLayanan] = useState([]);
  const [kendaraan, setKendaraan] = useState([]);
  const [pengguna, setPengguna] = useState([]);
  const [pengaduan, setPengaduan] = useState([]);

  const [periode, setPeriode] = useState(6);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      setLoading(true);

      const [layananRes, kendaraanRes, penggunaRes, pengaduanRes] =
        await Promise.allSettled([
          api.get("/layanan"),
          api.get("/kendaraan"),
          api.get("/pengguna"),
          api.get("/pengaduan"),
        ]);

      if (
        layananRes.status === "fulfilled" &&
        Array.isArray(layananRes.value.data)
      ) {
        setLayanan(layananRes.value.data);
      }

      if (
        kendaraanRes.status === "fulfilled" &&
        Array.isArray(kendaraanRes.value.data)
      ) {
        setKendaraan(kendaraanRes.value.data);
      }

      if (
        penggunaRes.status === "fulfilled" &&
        Array.isArray(penggunaRes.value.data)
      ) {
        setPengguna(penggunaRes.value.data);
      }

      if (
        pengaduanRes.status === "fulfilled" &&
        Array.isArray(pengaduanRes.value.data)
      ) {
        setPengaduan(pengaduanRes.value.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
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

  const isTerlambat = (item) => {
    const jatuhTempo = parseDate(item?.jatuhTempo);

    if (!jatuhTempo || isLunas(item)) {
      return false;
    }

    jatuhTempo.setHours(0, 0, 0, 0);

    return startOfToday() > jatuhTempo;
  };

  const getDeadlineInfo = (item) => {
    const jatuhTempo = parseDate(item?.jatuhTempo);

    if (!jatuhTempo) {
      return {
        text: "Belum ada jatuh tempo",
        tone: "neutral",
      };
    }

    jatuhTempo.setHours(0, 0, 0, 0);

    const difference = Math.ceil(
      (jatuhTempo.getTime() - startOfToday().getTime()) / DAY_IN_MS
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

    const terlambat = layanan.filter((item) => isTerlambat(item));

    const pendapatan = lunas.reduce((total, item) => {
      return (
        total +
        Number(item.nominalTagihan || 0) +
        Number(item.denda || 0)
      );
    }, 0);

    const totalDenda = lunas.reduce((total, item) => {
      return total + Number(item.denda || 0);
    }, 0);

    const persentaseLunas =
      layanan.length === 0
        ? 0
        : Math.round((lunas.length / layanan.length) * 100);

    return {
      lunas: lunas.length,
      belumLunas: belumLunas.length,
      terlambat: terlambat.length,
      pendapatan,
      totalDenda,
      persentaseLunas,
    };
  }, [layanan]);

  const monthlyData = useMemo(() => {
    const today = new Date();

    const months = Array.from({ length: periode }, (_, index) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - (periode - 1 - index),
        1
      );

      return {
        key: getMonthKey(date),
        bulan: new Intl.DateTimeFormat("id-ID", {
          month: "short",
        })
          .format(date)
          .replace(".", ""),
        pendapatan: 0,
        transaksi: 0,
      };
    });

    const monthMap = Object.fromEntries(
      months.map((item) => [item.key, item])
    );

    layanan
      .filter((item) => isLunas(item))
      .forEach((item) => {
        const tanggalBayar = parseDate(item.tanggalBayar);

        if (!tanggalBayar) return;

        const key = getMonthKey(tanggalBayar);

        if (!monthMap[key]) return;

        monthMap[key].pendapatan +=
          Number(item.nominalTagihan || 0) + Number(item.denda || 0);

        monthMap[key].transaksi += 1;
      });

    return months;
  }, [layanan, periode]);

  const statusData = [
    {
      name: "Lunas",
      value: stats.lunas,
      color: "#10b981",
    },
    {
      name: "Belum Lunas",
      value: stats.belumLunas,
      color: "#f59e0b",
    },
    {
      name: "Terlambat",
      value: stats.terlambat,
      color: "#ef4444",
    },
  ];

  const pieData = statusData.some((item) => item.value > 0)
    ? statusData
    : [
        {
          name: "Belum ada data",
          value: 1,
          color: "#dbe4f0",
        },
      ];

  const summaryData = [
    {
      name: "Warga",
      total: pengguna.length,
    },
    {
      name: "Kendaraan",
      total: kendaraan.length,
    },
    {
      name: "Tagihan",
      total: layanan.length,
    },
    {
      name: "Lunas",
      total: stats.lunas,
    },
    {
      name: "Aduan",
      total: pengaduan.length,
    },
  ];

  const recentPayments = useMemo(() => {
    return layanan
      .filter((item) => isLunas(item))
      .sort((a, b) => {
        const dateA = parseDate(a.tanggalBayar)?.getTime() || 0;
        const dateB = parseDate(b.tanggalBayar)?.getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [layanan]);

  const deadlines = useMemo(() => {
    return layanan
      .filter((item) => !isLunas(item) && item.jatuhTempo)
      .sort((a, b) => {
        const dateA = parseDate(a.jatuhTempo)?.getTime() || 0;
        const dateB = parseDate(b.jatuhTempo)?.getTime() || 0;

        return dateA - dateB;
      })
      .slice(0, 5);
  }, [layanan]);

  const cards = [
    {
      title: "Pendapatan Pajak",
      value: formatCompactRupiah(stats.pendapatan),
      detail: formatRupiah(stats.pendapatan),
      icon: CircleDollarSign,
      tone: "blue",
    },
    {
      title: "Tagihan Lunas",
      value: stats.lunas,
      detail: `${stats.persentaseLunas}% dari seluruh tagihan`,
      icon: CheckCircle2,
      tone: "green",
    },
    {
      title: "Belum Lunas",
      value: stats.belumLunas,
      detail: "Masih menunggu pembayaran",
      icon: CreditCard,
      tone: "orange",
    },
    {
      title: "Total Denda",
      value: formatCompactRupiah(stats.totalDenda),
      detail: formatRupiah(stats.totalDenda),
      icon: AlertTriangle,
      tone: "red",
    },
  ];

  return (
    <div className="premium-shell admin-v3-shell">
      <PremiumBackground />
      <Navbar />

      <div className="layout premium-layout">
        <Sidebar />

        <main className="content premium-content admin-v3-content">
          <motion.section
            className="admin-v3-hero"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="admin-v3-hero-copy">
              <span className="admin-v3-eyebrow">
                <ShieldCheck size={17} />
                SAMSAT Tax Intelligence
              </span>

              <h1>Kontrol Pajak Kendaraan dalam Satu Dashboard.</h1>

              <p>
                Pantau masyarakat, kendaraan, tagihan, pendapatan, keterlambatan,
                denda, dan pengaduan melalui pusat data SAMSAT Digital.
              </p>

              <div className="admin-v3-hero-actions">
                <Link to="/admin/tagihan">
                  Buat Tagihan
                  <ArrowUpRight size={17} />
                </Link>

                <button
                  type="button"
                  onClick={refreshDashboard}
                  disabled={refreshing}
                >
                  <RefreshCw
                    size={17}
                    className={refreshing ? "admin-v3-spin" : ""}
                  />
                  Refresh Data
                </button>
              </div>
            </div>

            <TiltCard className="admin-v3-health-card">
              <div className="admin-v3-health-head">
                <div>
                  <span>Payment Collection</span>
                  <h3>Tingkat Pembayaran</h3>
                </div>

                <TrendingUp size={24} />
              </div>

              <strong>{stats.persentaseLunas}%</strong>

              <div className="admin-v3-progress">
                <span style={{ width: `${stats.persentaseLunas}%` }} />
              </div>

              <p>
                {stats.lunas} dari {layanan.length} tagihan sudah dibayar
              </p>
            </TiltCard>
          </motion.section>

          {loading ? (
            <div className="admin-v3-loading">
              <RefreshCw className="admin-v3-spin" size={22} />
              Memuat dashboard pajak...
            </div>
          ) : (
            <>
              <section className="admin-v3-kpi-grid">
                {cards.map((card, index) => {
                  const Icon = card.icon;

                  return (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                    >
                      <TiltCard className={`admin-v3-kpi-card ${card.tone}`}>
                        <div className="admin-v3-kpi-top">
                          <div className="admin-v3-kpi-icon">
                            <Icon size={22} />
                          </div>

                          <TrendingUp size={18} />
                        </div>

                        <p>{card.title}</p>
                        <h2>{card.value}</h2>
                        <span>{card.detail}</span>
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </section>

              <section className="admin-v3-grid">
                <div className="admin-v3-panel admin-v3-trend-panel">
                  <div className="admin-v3-panel-head">
                    <div>
                      <span>Revenue Analytics</span>
                      <h3>Tren Pendapatan Pajak</h3>
                      <p>Nilai pembayaran lunas berdasarkan data transaksi.</p>
                    </div>

                    <div className="admin-v3-filter">
                      <button
                        type="button"
                        className={periode === 6 ? "active" : ""}
                        onClick={() => setPeriode(6)}
                      >
                        6 Bulan
                      </button>

                      <button
                        type="button"
                        className={periode === 12 ? "active" : ""}
                        onClick={() => setPeriode(12)}
                      >
                        12 Bulan
                      </button>
                    </div>
                  </div>

                  <div className="admin-v3-chart-holder">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient
                            id="adminRevenueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="4%"
                              stopColor="#2563eb"
                              stopOpacity={0.42}
                            />
                            <stop
                              offset="96%"
                              stopColor="#2563eb"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="4 6"
                          stroke="#dbe4f0"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="bulan"
                          stroke="#94a3b8"
                          tickLine={false}
                          axisLine={false}
                        />

                        <YAxis
                          stroke="#94a3b8"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => formatCompactRupiah(value)}
                        />

                        <Tooltip
                          formatter={(value) => [
                            formatRupiah(value),
                            "Pendapatan",
                          ]}
                        />

                        <Area
                          type="monotone"
                          dataKey="pendapatan"
                          stroke="#2563eb"
                          strokeWidth={4}
                          fill="url(#adminRevenueGradient)"
                          dot={{
                            fill: "#2563eb",
                            strokeWidth: 4,
                            r: 4,
                          }}
                          activeDot={{
                            r: 7,
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="admin-v3-panel admin-v3-status-panel">
                  <div className="admin-v3-panel-head">
                    <div>
                      <span>Payment Status</span>
                      <h3>Status Tagihan</h3>
                      <p>Perbandingan pembayaran PKB.</p>
                    </div>
                  </div>

                  <div className="admin-v3-donut-wrap">
                    <ResponsiveContainer width="100%" height={230}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={72}
                          outerRadius={98}
                          paddingAngle={5}
                          stroke="none"
                        >
                          {pieData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color}
                            />
                          ))}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="admin-v3-donut-center">
                      <strong>{stats.persentaseLunas}%</strong>
                      <span>terbayar</span>
                    </div>
                  </div>

                  <div className="admin-v3-status-legend">
                    {statusData.map((item) => (
                      <div key={item.name}>
                        <span style={{ background: item.color }} />
                        <p>{item.name}</p>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-v3-panel admin-v3-summary-panel">
                  <div className="admin-v3-panel-head">
                    <div>
                      <span>Data Center</span>
                      <h3>Ringkasan Sistem</h3>
                      <p>Jumlah data pada setiap layanan.</p>
                    </div>
                  </div>

                  <div className="admin-v3-chart-holder small">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={summaryData}>
                        <CartesianGrid
                          strokeDasharray="4 6"
                          stroke="#dbe4f0"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="name"
                          stroke="#94a3b8"
                          tickLine={false}
                          axisLine={false}
                        />

                        <YAxis
                          allowDecimals={false}
                          stroke="#94a3b8"
                          tickLine={false}
                          axisLine={false}
                        />

                        <Tooltip />

                        <Bar
                          dataKey="total"
                          fill="#14b8a6"
                          radius={[12, 12, 4, 4]}
                          barSize={34}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="admin-v3-panel admin-v3-deadline-panel">
                  <div className="admin-v3-panel-head">
                    <div>
                      <span>Tax Reminder</span>
                      <h3>Jatuh Tempo Tagihan</h3>
                      <p>Tagihan yang perlu segera diperhatikan.</p>
                    </div>

                    <Link to="/admin/tagihan">Lihat Semua</Link>
                  </div>

                  <div className="admin-v3-deadline-list">
                    {deadlines.length === 0 ? (
                      <div className="admin-v3-empty">
                        <CheckCircle2 size={22} />
                        Tidak ada tagihan tertunda.
                      </div>
                    ) : (
                      deadlines.map((item) => {
                        const deadline = getDeadlineInfo(item);

                        return (
                          <div
                            className="admin-v3-deadline-item"
                            key={item.id}
                          >
                            <div className="admin-v3-deadline-icon">
                              <CalendarClock size={18} />
                            </div>

                            <div>
                              <strong>
                                {item.kendaraan?.platNomor || "Tanpa plat nomor"}
                              </strong>

                              <span>
                                {item.kendaraan?.pengguna?.nama ||
                                  "Pemilik tidak ditemukan"}
                              </span>
                            </div>

                            <div className="admin-v3-deadline-meta">
                              <strong>
                                {formatRupiah(item.nominalTagihan)}
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
              </section>

              <section className="admin-v3-panel admin-v3-transaction-panel">
                <div className="admin-v3-panel-head">
                  <div>
                    <span>Latest Payments</span>
                    <h3>Transaksi Pembayaran Terbaru</h3>
                    <p>Pembayaran pajak kendaraan yang baru diselesaikan.</p>
                  </div>

                  <Link to="/admin/laporan">Buka Laporan</Link>
                </div>

                <div className="admin-v3-table-wrap">
                  <table className="admin-v3-table">
                    <thead>
                      <tr>
                        <th>Pemilik</th>
                        <th>Kendaraan</th>
                        <th>Tahun Pajak</th>
                        <th>Nominal</th>
                        <th>Denda</th>
                        <th>Tanggal Bayar</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentPayments.length === 0 ? (
                        <tr>
                          <td colSpan="7">
                            Belum ada transaksi pembayaran.
                          </td>
                        </tr>
                      ) : (
                        recentPayments.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <strong>
                                {item.kendaraan?.pengguna?.nama || "-"}
                              </strong>
                            </td>

                            <td>
                              <span className="admin-v3-plate">
                                {item.kendaraan?.platNomor || "-"}
                              </span>
                            </td>

                            <td>{item.tahunPajak || "-"}</td>

                            <td>{formatRupiah(item.nominalTagihan)}</td>

                            <td>{formatRupiah(item.denda)}</td>

                            <td>{formatTanggalWaktu(item.tanggalBayar)}</td>

                            <td>
                              <span className="admin-v3-paid-badge">
                                LUNAS
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="admin-v3-quick-grid">
                <Link to="/admin/pengguna">
                  <Users size={22} />
                  <div>
                    <h3>Data Masyarakat</h3>
                    <p>{pengguna.length} wajib pajak terdaftar</p>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>

                <Link to="/admin/kendaraan">
                  <Car size={22} />
                  <div>
                    <h3>Data Kendaraan</h3>
                    <p>{kendaraan.length} kendaraan tersimpan</p>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>

                <Link to="/admin/tagihan">
                  <Receipt size={22} />
                  <div>
                    <h3>Tagihan Pajak</h3>
                    <p>{layanan.length} tagihan PKB</p>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>

                <Link to="/admin/pengaduan">
                  <MessageSquare size={22} />
                  <div>
                    <h3>Pengaduan</h3>
                    <p>{pengaduan.length} pengaduan masyarakat</p>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>

                <Link to="/admin/laporan">
                  <FileText size={22} />
                  <div>
                    <h3>Laporan Pajak</h3>
                    <p>Rekap pembayaran PKB</p>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;