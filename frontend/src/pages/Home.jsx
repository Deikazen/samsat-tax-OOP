import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarClock,
  Car,
  CheckCircle2,
  CreditCard,
  FileText,
  Gauge,
  Landmark,
  Receipt,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import PremiumBackground from "../components/PremiumBackground";
import TiltCard from "../components/TiltCard";
import LandingNavbar from "../components/LandingNavbar";

function Home() {
  const layanan = [
    {
      icon: Car,
      title: "Data Kendaraan",
      desc: "Kendaraan masyarakat tersimpan berdasarkan pemilik dan NIK.",
    },
    {
      icon: CreditCard,
      title: "Tagihan Pajak",
      desc: "Admin dapat membuat tagihan PKB lengkap dengan jatuh tempo.",
    },
    {
      icon: AlertTriangle,
      title: "Denda Otomatis",
      desc: "Denda dihitung otomatis jika pembayaran melewati jatuh tempo.",
    },
    {
      icon: Receipt,
      title: "Bukti Pembayaran",
      desc: "Setelah lunas, masyarakat dapat mencetak bukti pembayaran.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Admin Membuat Tagihan",
      desc: "Admin memilih kendaraan, menentukan nominal pajak, tahun pajak, dan jatuh tempo.",
    },
    {
      number: "02",
      title: "Masyarakat Cek Tagihan",
      desc: "Masyarakat login dan melihat tagihan pajak kendaraan miliknya.",
    },
    {
      number: "03",
      title: "Bayar Pajak",
      desc: "Masyarakat melakukan pembayaran. Status berubah menjadi LUNAS.",
    },
    {
      number: "04",
      title: "Cetak Bukti",
      desc: "Bukti pembayaran dapat dicetak atau disimpan sebagai PDF.",
    },
  ];

  return (
    <main className="home-page">
      <PremiumBackground dark />
      <LandingNavbar />

      <section className="home-hero">
        <motion.div
          className="home-hero-content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="home-eyebrow">
            <ShieldCheck size={18} />
            Sistem Informasi Pajak Kendaraan Bermotor
          </div>

          <h1>
            Bayar Pajak Kendaraan Jadi Lebih Mudah, Cepat, dan Transparan.
          </h1>

          <p>
            SAMSAT Digital membantu admin dan masyarakat mengelola data
            kendaraan, tagihan pajak, jatuh tempo, denda, pembayaran, pengaduan,
            laporan, sampai bukti pembayaran secara online.
          </p>

          <div className="home-hero-actions">
            <Link to="/login" className="home-primary-btn">
              Masuk Dashboard
              <ArrowRight size={18} />
            </Link>

            <Link to="/register" className="home-secondary-btn">
              Daftar Masyarakat
            </Link>
          </div>

          <div className="home-trust-row">
            <span>
              <CheckCircle2 size={16} /> Role otomatis
            </span>
            <span>
              <CheckCircle2 size={16} /> Data MySQL
            </span>
            <span>
              <CheckCircle2 size={16} /> Bukti PDF
            </span>
          </div>
        </motion.div>

        <motion.div
          className="home-hero-visual"
          initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <TiltCard className="tax-main-3d-card">
            <div className="tax-main-card-top">
              <Landmark size={28} />
              <span>SAMSAT TAX CARD</span>
            </div>

            <div className="tax-main-card-center">
              <p>Vehicle Tax Payment</p>
              <h2>PKB • DIGITAL</h2>
              <span>Secure Transaction</span>
            </div>

            <div className="tax-main-card-bottom">
              <strong>ACTIVE</strong>
              <span>2026</span>
            </div>
          </TiltCard>

          <div className="floating-tax-widget widget-income">
            <Banknote size={22} />
            <div>
              <span>Total Pajak</span>
              <strong>Rp 12.450.000</strong>
            </div>
          </div>

          <div className="floating-tax-widget widget-paid">
            <BadgeCheck size={22} />
            <div>
              <span>Status</span>
              <strong>LUNAS</strong>
            </div>
          </div>

          <div className="floating-tax-widget widget-due">
            <CalendarClock size={22} />
            <div>
              <span>Jatuh Tempo</span>
              <strong>30 Mei 2026</strong>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="home-stats">
        <TiltCard className="home-stat-card">
          <Gauge size={28} />
          <h3>Realtime</h3>
          <p>Data tagihan dan pembayaran langsung diambil dari backend.</p>
        </TiltCard>

        <TiltCard className="home-stat-card">
          <Smartphone size={28} />
          <h3>Digital</h3>
          <p>Masyarakat dapat mengakses layanan dari dashboard web.</p>
        </TiltCard>

        <TiltCard className="home-stat-card">
          <FileText size={28} />
          <h3>Terarsip</h3>
          <p>Bukti pembayaran dan laporan dapat digunakan untuk arsip.</p>
        </TiltCard>
      </section>

      <section className="home-section" id="layanan">
        <div className="home-section-head">
          <span>Layanan Utama</span>
          <h2>Satu Sistem untuk Kebutuhan Pajak Kendaraan</h2>
          <p>
            Sistem ini dirancang untuk membantu proses administrasi pajak
            kendaraan dari sisi admin maupun masyarakat.
          </p>
        </div>

        <div className="service-grid">
          {layanan.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <TiltCard className="service-card">
                  <div className="service-icon">
                    <Icon size={26} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="home-section tax-info-section" id="alur">
        <div className="home-section-head">
          <span>Alur Sistem</span>
          <h2>Proses Pajak Kendaraan dari Tagihan sampai Bukti Bayar</h2>
        </div>

        <div className="flow-timeline">
          {steps.map((item, index) => (
            <motion.div
              className="flow-card"
              key={item.number}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <span>{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="home-section denda-section" id="denda">
        <div className="denda-copy">
          <span>Denda Otomatis</span>
          <h2>Denda Pajak Dihitung Berdasarkan Keterlambatan</h2>
          <p>
            Admin hanya menentukan tanggal jatuh tempo. Jika pembayaran melewati
            jatuh tempo, sistem menghitung jumlah bulan keterlambatan secara
            otomatis.
          </p>

          <div className="formula-box">
            Denda = Rp50.000 × Jumlah Bulan Telat
          </div>
        </div>

        <TiltCard className="denda-card">
          <h3>Simulasi Denda</h3>

          <div className="denda-row">
            <span>Telat 1 bulan</span>
            <strong>Rp50.000</strong>
          </div>

          <div className="denda-row">
            <span>Telat 2 bulan</span>
            <strong>Rp100.000</strong>
          </div>

          <div className="denda-row">
            <span>Telat 3 bulan</span>
            <strong>Rp150.000</strong>
          </div>

          <div className="denda-total">
            <span>Total Bayar</span>
            <strong>Nominal Pajak + Denda</strong>
          </div>
        </TiltCard>
      </section>

      <section className="home-section faq-section" id="faq">
        <div className="home-section-head">
          <span>Informasi</span>
          <h2>Pertanyaan yang Sering Ditanyakan</h2>
        </div>

        <div className="faq-grid">
          <div>
            <h3>Apakah user memilih role sendiri?</h3>
            <p>
              Tidak. Role ditentukan oleh sistem berdasarkan data akun di
              database.
            </p>
          </div>

          <div>
            <h3>Siapa yang membuat tagihan pajak?</h3>
            <p>
              Admin membuat tagihan pajak berdasarkan kendaraan milik masyarakat.
            </p>
          </div>

          <div>
            <h3>Apakah denda diinput manual?</h3>
            <p>
              Tidak. Denda dihitung otomatis berdasarkan tanggal jatuh tempo dan
              jumlah bulan keterlambatan.
            </p>
          </div>

          <div>
            <h3>Apakah bukti pembayaran bisa disimpan?</h3>
            <p>
              Bisa. Bukti pembayaran dapat dicetak atau disimpan sebagai PDF
              melalui fitur print browser.
            </p>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <h2>Mulai Kelola Pajak Kendaraan Secara Digital</h2>
        <p>
          Masuk sebagai admin untuk mengelola sistem, atau daftar sebagai
          masyarakat untuk melihat kendaraan dan membayar pajak.
        </p>

        <div>
          <Link to="/login" className="home-primary-btn">
            Login Sekarang
            <ArrowRight size={18} />
          </Link>

          <Link to="/register" className="home-secondary-btn">
            Registrasi
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;