import { createPortal } from "react-dom";
import {
  CalendarDays,
  Car,
  CheckCircle2,
  CreditCard,
  Download,
  FileCheck2,
  Hash,
  Landmark,
  ReceiptText,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

function BuktiPembayaranModal({ data, onClose }) {
  if (!data) return null;

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const formatTanggalWaktu = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const nominalTagihan = Number(data.nominalTagihan || 0);
  const denda = Number(data.denda || 0);
  const totalPembayaran = nominalTagihan + denda;

  const nomorTransaksi = `TRX-SAMSAT-${data.tahunPajak || "PKB"}-${String(
    data.id || 0
  ).padStart(4, "0")}`;

  const pemilik = data.kendaraan?.pengguna;

  const namaPemilik = pemilik?.nama || "-";
  const nikPemilik = pemilik?.nik || "-";
  const emailPemilik = pemilik?.email || "-";

  const platNomor = data.kendaraan?.platNomor || "-";
  const merekKendaraan = data.kendaraan?.merek || "-";
  const tahunPajak = data.tahunPajak || "-";
  const metodePembayaran = data.metodePembayaran || "-";
  const tanggalPembayaran = formatTanggalWaktu(data.tanggalBayar);

  const handlePrint = () => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=1000,left=120,top=40"
    );

    if (!printWindow) {
      alert(
        "Popup diblokir browser. Izinkan popup untuk mencetak bukti pembayaran."
      );

      return;
    }

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>Bukti Pembayaran ${nomorTransaksi}</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 12mm;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              color: #0f172a;
              background: #ffffff;
              font-family: Arial, Helvetica, sans-serif;
            }

            body {
              padding: 0;
            }

            .receipt-paper {
              width: 100%;
              max-width: 760px;
              margin: 0 auto;
              padding: 24px;
              border: 1px solid #dbe4f0;
              border-radius: 18px;
              background: #ffffff;
            }

            .brand {
              display: grid;
              grid-template-columns: auto 1fr auto;
              align-items: center;
              gap: 12px;
            }

            .logo {
              width: 50px;
              height: 50px;
              display: grid;
              place-items: center;
              border-radius: 16px;
              color: #ffffff;
              background: linear-gradient(135deg, #2563eb, #06b6d4);
              font-size: 24px;
              font-weight: 900;
            }

            .brand h1 {
              margin: 0;
              color: #123d94;
              font-size: 22px;
              letter-spacing: 0.8px;
            }

            .brand p {
              margin: 5px 0 0;
              color: #64748b;
              font-size: 11px;
              font-weight: 700;
            }

            .valid {
              padding: 8px 10px;
              border-radius: 999px;
              color: #047857;
              background: #d1fae5;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }

            .divider {
              margin: 18px 0;
              border-top: 1px dashed #bfdbfe;
            }

            .status-section {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 16px;
            }

            .label {
              display: block;
              color: #2563eb;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: 0.6px;
              text-transform: uppercase;
            }

            .status-section h2 {
              margin: 6px 0 5px;
              color: #0f172a;
              font-size: 23px;
            }

            .status-section p {
              max-width: 540px;
              margin: 0;
              color: #64748b;
              font-size: 11px;
              line-height: 1.6;
            }

            .status-badge {
              flex-shrink: 0;
              padding: 9px 12px;
              border: 1px solid #a7f3d0;
              border-radius: 999px;
              color: #047857;
              background: #d1fae5;
              font-size: 11px;
              font-weight: 900;
              letter-spacing: 0.6px;
            }

            .highlight-grid,
            .content-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 10px;
            }

            .highlight-grid {
              margin-top: 17px;
            }

            .highlight-card {
              padding: 12px;
              border: 1px solid #dbeafe;
              border-radius: 14px;
              background: #eff6ff;
            }

            .highlight-card span {
              display: block;
              color: #2563eb;
              font-size: 9px;
              font-weight: 900;
              letter-spacing: 0.45px;
              text-transform: uppercase;
            }

            .highlight-card strong {
              display: block;
              margin-top: 7px;
              color: #0f172a;
              font-size: 12px;
            }

            .content-grid {
              margin-top: 11px;
            }

            .info-card,
            .payment-card {
              padding: 14px;
              border: 1px solid #e2e8f0;
              border-radius: 15px;
              background: #f8fafc;
            }

            .info-card h3,
            .payment-card h3 {
              margin: 0 0 11px;
              color: #0f172a;
              font-size: 13px;
            }

            .info-row {
              padding: 8px 0;
              border-top: 1px solid #e2e8f0;
            }

            .info-row span {
              display: block;
              color: #94a3b8;
              font-size: 9px;
              font-weight: 900;
              letter-spacing: 0.45px;
              text-transform: uppercase;
            }

            .info-row strong {
              display: block;
              margin-top: 5px;
              color: #0f172a;
              font-size: 11px;
            }

            .plate {
              width: fit-content;
              padding: 5px 8px;
              border-radius: 7px;
              color: #1e3a8a !important;
              background: #dbeafe;
              letter-spacing: 0.5px;
            }

            .payment-card {
              margin-top: 11px;
            }

            .payment-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 14px;
              padding: 9px 0;
              border-bottom: 1px solid #e2e8f0;
            }

            .payment-row span {
              color: #64748b;
              font-size: 11px;
              font-weight: 700;
            }

            .payment-row strong {
              color: #0f172a;
              font-size: 11px;
            }

            .total {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 14px;
              margin-top: 12px;
              padding: 14px;
              border-radius: 14px;
              color: #ffffff;
              background: linear-gradient(135deg, #1d4ed8, #0891b2);
            }

            .total span {
              color: #dbeafe;
              font-size: 11px;
              font-weight: 900;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }

            .total strong {
              color: #ffffff;
              font-size: 20px;
            }

            .footer {
              margin-top: 12px;
              padding: 11px;
              border: 1px solid #e2e8f0;
              border-radius: 13px;
              color: #64748b;
              background: #f8fafc;
              font-size: 9px;
              line-height: 1.6;
            }

            .print-note {
              margin-top: 9px;
              color: #94a3b8;
              font-size: 8px;
              text-align: center;
            }

            @media print {
              html,
              body {
                width: 100%;
                margin: 0;
                padding: 0;
                background: #ffffff;
              }

              .receipt-paper {
                max-width: none;
                border: none;
                border-radius: 0;
              }
            }
          </style>
        </head>

        <body>
          <article class="receipt-paper">
            <header class="brand">
              <div class="logo">S</div>

              <div>
                <h1>SAMSAT DIGITAL</h1>
                <p>Sistem Informasi Pajak Kendaraan Bermotor</p>
              </div>

              <span class="valid">Dokumen Valid</span>
            </header>

            <div class="divider"></div>

            <section class="status-section">
              <div>
                <span class="label">
                  Bukti Pembayaran Pajak Kendaraan
                </span>

                <h2>Transaksi Berhasil</h2>

                <p>
                  Pembayaran pajak kendaraan telah tercatat pada sistem
                  SAMSAT Digital.
                </p>
              </div>

              <span class="status-badge">LUNAS</span>
            </section>

            <section class="highlight-grid">
              <div class="highlight-card">
                <span>Nomor Transaksi</span>
                <strong>${nomorTransaksi}</strong>
              </div>

              <div class="highlight-card">
                <span>Tanggal Pembayaran</span>
                <strong>${tanggalPembayaran}</strong>
              </div>
            </section>

            <section class="content-grid">
              <div class="info-card">
                <h3>Data Wajib Pajak</h3>

                <div class="info-row">
                  <span>Nama Pemilik</span>
                  <strong>${namaPemilik}</strong>
                </div>

                <div class="info-row">
                  <span>NIK</span>
                  <strong>${nikPemilik}</strong>
                </div>

                <div class="info-row">
                  <span>Email</span>
                  <strong>${emailPemilik}</strong>
                </div>
              </div>

              <div class="info-card">
                <h3>Data Kendaraan</h3>

                <div class="info-row">
                  <span>Plat Nomor</span>
                  <strong class="plate">${platNomor}</strong>
                </div>

                <div class="info-row">
                  <span>Merek Kendaraan</span>
                  <strong>${merekKendaraan}</strong>
                </div>

                <div class="info-row">
                  <span>Tahun Pajak</span>
                  <strong>${tahunPajak}</strong>
                </div>
              </div>
            </section>

            <section class="payment-card">
              <h3>Rincian Pembayaran</h3>

              <div class="payment-row">
                <span>Nominal pajak kendaraan</span>
                <strong>${formatRupiah(nominalTagihan)}</strong>
              </div>

              <div class="payment-row">
                <span>Denda keterlambatan</span>
                <strong>${formatRupiah(denda)}</strong>
              </div>

              <div class="payment-row">
                <span>Metode pembayaran</span>
                <strong>${metodePembayaran}</strong>
              </div>

              <div class="total">
                <span>Total Pembayaran</span>
                <strong>${formatRupiah(totalPembayaran)}</strong>
              </div>
            </section>

            <footer class="footer">
              Bukti pembayaran ini diterbitkan secara digital oleh sistem
              SAMSAT Digital dan dapat digunakan sebagai arsip pembayaran PKB.
            </footer>

            <p class="print-note">
              Dokumen dibuat otomatis oleh SAMSAT Digital.
            </p>
          </article>

          <script>
            window.onload = function () {
              setTimeout(function () {
                window.print();
              }, 350);
            };

            window.onafterprint = function () {
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return createPortal(
    <div
      className="pkb-print-root pkb-receipt-overlay"
      onClick={onClose}
    >
      <section
        className="pkb-receipt-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="pkb-receipt-modal-header">
          <div>
            <span className="pkb-receipt-header-label">
              Payment Receipt
            </span>

            <h2>Bukti Pembayaran PKB</h2>
          </div>

          <button
            type="button"
            className="pkb-receipt-close"
            onClick={onClose}
            aria-label="Tutup bukti pembayaran"
          >
            <X size={19} />
          </button>
        </header>

        <div className="pkb-receipt-scroll">
          <article className="pkb-receipt-paper">
            <div className="pkb-receipt-brand">
              <div className="pkb-receipt-logo">
                <ShieldCheck size={26} />
              </div>

              <div>
                <h1>SAMSAT DIGITAL</h1>
                <p>Sistem Informasi Pajak Kendaraan Bermotor</p>
              </div>

              <div className="pkb-receipt-valid">
                <FileCheck2 size={17} />
                Dokumen Valid
              </div>
            </div>

            <div className="pkb-receipt-divider" />

            <section className="pkb-receipt-status-section">
              <div>
                <span className="pkb-receipt-section-label">
                  Bukti Pembayaran Pajak Kendaraan
                </span>

                <h2>Transaksi Berhasil</h2>

                <p>
                  Pembayaran pajak kendaraan telah tercatat pada sistem
                  SAMSAT Digital.
                </p>
              </div>

              <div className="pkb-receipt-status-badge">
                <CheckCircle2 size={18} />
                LUNAS
              </div>
            </section>

            <section className="pkb-receipt-highlight-grid">
              <div>
                <span>
                  <Hash size={15} />
                  Nomor Transaksi
                </span>

                <strong>{nomorTransaksi}</strong>
              </div>

              <div>
                <span>
                  <CalendarDays size={15} />
                  Tanggal Pembayaran
                </span>

                <strong>{tanggalPembayaran}</strong>
              </div>
            </section>

            <section className="pkb-receipt-content-grid">
              <div className="pkb-receipt-info-card">
                <div className="pkb-receipt-info-title">
                  <UserRound size={18} />
                  <h3>Data Wajib Pajak</h3>
                </div>

                <div className="pkb-receipt-info-list">
                  <div>
                    <span>Nama Pemilik</span>
                    <strong>{namaPemilik}</strong>
                  </div>

                  <div>
                    <span>NIK</span>
                    <strong>{nikPemilik}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{emailPemilik}</strong>
                  </div>
                </div>
              </div>

              <div className="pkb-receipt-info-card">
                <div className="pkb-receipt-info-title">
                  <Car size={18} />
                  <h3>Data Kendaraan</h3>
                </div>

                <div className="pkb-receipt-info-list">
                  <div>
                    <span>Plat Nomor</span>

                    <strong className="pkb-receipt-plate">
                      {platNomor}
                    </strong>
                  </div>

                  <div>
                    <span>Merek Kendaraan</span>
                    <strong>{merekKendaraan}</strong>
                  </div>

                  <div>
                    <span>Tahun Pajak</span>
                    <strong>{tahunPajak}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="pkb-receipt-payment-card">
              <div className="pkb-receipt-info-title">
                <ReceiptText size={18} />
                <h3>Rincian Pembayaran</h3>
              </div>

              <div className="pkb-receipt-payment-row">
                <span>Nominal pajak kendaraan</span>
                <strong>{formatRupiah(nominalTagihan)}</strong>
              </div>

              <div className="pkb-receipt-payment-row">
                <span>Denda keterlambatan</span>
                <strong>{formatRupiah(denda)}</strong>
              </div>

              <div className="pkb-receipt-payment-row">
                <span>Metode pembayaran</span>

                <strong className="pkb-receipt-method">
                  <CreditCard size={15} />
                  {metodePembayaran}
                </strong>
              </div>

              <div className="pkb-receipt-total">
                <span>Total Pembayaran</span>
                <strong>{formatRupiah(totalPembayaran)}</strong>
              </div>
            </section>

            <footer className="pkb-receipt-paper-footer">
              <Landmark size={18} />

              <p>
                Bukti pembayaran ini diterbitkan secara digital oleh sistem
                SAMSAT Digital dan dapat digunakan sebagai arsip pembayaran PKB.
              </p>
            </footer>
          </article>
        </div>

        <footer className="pkb-receipt-modal-footer">
          <button
            type="button"
            className="pkb-receipt-secondary-btn"
            onClick={onClose}
          >
            <X size={17} />
            Tutup
          </button>

          <button
            type="button"
            className="pkb-receipt-primary-btn"
            onClick={handlePrint}
          >
            <Download size={17} />
            Cetak / Simpan PDF
          </button>
        </footer>
      </section>
    </div>,
    document.body
  );
}

export default BuktiPembayaranModal;