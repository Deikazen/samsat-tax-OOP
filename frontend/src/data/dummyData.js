export const users = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    nama: "Admin Samsat",
    role: "ADMIN",
  },
  {
    id: 2,
    username: "budi",
    password: "budi123",
    nama: "Budi Santoso",
    role: "MASYARAKAT",
  },
];

export const pengguna = [
  {
    id: 1,
    nama: "Budi Santoso",
    nik: "3273010101010001",
    alamat: "Bandung",
    noHp: "08123456789",
  },
  {
    id: 2,
    nama: "Siti Aminah",
    nik: "3273010202020002",
    alamat: "Cimahi",
    noHp: "08234567890",
  },
];

export const kendaraan = [
  {
    id: 1,
    pemilik: "Budi Santoso",
    plat: "D 1234 AB",
    merk: "Honda Beat",
    tahun: 2021,
    status: "Aktif",
  },
  {
    id: 2,
    pemilik: "Siti Aminah",
    plat: "D 4321 CD",
    merk: "Yamaha NMAX",
    tahun: 2020,
    status: "Aktif",
  },
];

export const tagihan = [
  {
    id: 1,
    nama: "Budi Santoso",
    plat: "D 1234 AB",
    jenis: "PKB Tahunan",
    jumlah: 350000,
    status: "Belum Bayar",
  },
  {
    id: 2,
    nama: "Siti Aminah",
    plat: "D 4321 CD",
    jenis: "PKB Tahunan",
    jumlah: 500000,
    status: "Sudah Bayar",
  },
];

export const pengaduan = [
  {
    id: 1,
    nama: "Budi Santoso",
    isi: "Data kendaraan saya belum muncul.",
    status: "Diproses",
  },
  {
    id: 2,
    nama: "Siti Aminah",
    isi: "Pembayaran belum terverifikasi.",
    status: "Selesai",
  },
];