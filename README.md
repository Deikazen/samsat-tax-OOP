# 🚗 SAMSAT TAX - Sistem Pelayanan Masyarakat Digital

Sistem terintegrasi untuk pengelolaan layanan pajak kendaraan bermotor (PKB) berbasis web yang menghubungkan masyarakat dengan Sistem Manajemen Administrasi SAMSAT secara digital.

![Tech Stack](https://img.shields.io/badge/Stack-Java%20|%20React%20|%20MySQL-blue?style=flat-square)
![License](https://img.shields.io/badge/License-Open%20Source-green?style=flat-square)

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi & Stack](#teknologi--stack)
- [Struktur Folder](#struktur-folder)
- [Instalasi & Setup](#instalasi--setup)
- [Dokumentasi API](#dokumentasi-api)
- [Fitur Sistem](#fitur-sistem)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [Kontribusi](#kontribusi)

---

## 🌟 Fitur Utama

### Untuk Masyarakat (Citizen)
- ✅ Registrasi dan login akun
- ✅ Melihat data kendaraan pribadi
- ✅ Melihat tagihan pajak kendaraan
- ✅ Melakukan pembayaran pajak online
- ✅ Mencetak bukti pembayaran
- ✅ Mengajukan pengaduan/laporan

### Untuk Admin (Administrator)
- ✅ Kelola data masyarakat/wajib pajak
- ✅ Kelola data kendaraan
- ✅ Kelola tagihan pajak (PKB)
- ✅ Lihat ringkasan/statistik dashboard
- ✅ Kelola status pengaduan
- ✅ Sistem denda otomatis untuk keterlambatan pembayaran

---

## 🛠️ Teknologi & Stack

### Backend
| Komponen | Teknologi |
|----------|-----------|
| **Language** | Java 21 |
| **Framework** | Spring Boot |
| **Database Access** | Spring Data JPA |
| **Web** | Spring Web |
| **Database Driver** | MySQL Driver |
| **Utilities** | Lombok |

### Frontend
| Komponen | Teknologi |
|----------|-----------|
| **Framework** | React Vite |
| **Routing** | React Router DOM |
| **HTTP Client** | Axios |
| **Styling** | Vanilla CSS |

### Database
| Komponen | Teknologi |
|----------|-----------|
| **DBMS** | MySQL |
| **Schema** | Relational Model |

---

## 📁 Struktur Folder

```
samsat-tax-OOP/
├── backend/                          # Aplikasi Backend (Spring Boot)
│   ├── src/
│   │   ├── main/java/com/...        # Source code Java
│   │   │   ├── controller/          # REST API Controller
│   │   │   ├── service/             # Business Logic
│   │   │   ├── model/               # Entity Models
│   │   │   └── repository/          # Database Access Layer
│   │   └── resources/
│   │       ├── application.properties # Konfigurasi aplikasi
│   │       └── data.sql             # Inisialisasi database
│   ├── README.md                    # Dokumentasi Backend
│   └── pom.xml                      # Maven Dependencies
│
├── frontend/                         # Aplikasi Frontend (React Vite)
│   ├── src/
│   │   ├── components/              # React Components
│   │   ├── pages/                   # Page Components
│   │   ├── services/                # API Services (Axios)
│   │   ├── styles/                  # CSS Files
│   │   └── App.jsx                  # Main App Component
│   ├── README.md                    # Dokumentasi Frontend
│   ├── package.json                 # NPM Dependencies
│   └── vite.config.js               # Vite Configuration
│
└── README.md                         # This file
```

---

## 🚀 Instalasi & Setup

### Prerequisites
- **Java 21** (untuk backend)
- **Node.js LTS** (untuk frontend)
- **MySQL 8.0+** (database)
- **Git** (version control)

### Step 1: Clone Repository
```bash
git clone https://github.com/Deikazen/samsat-tax-OOP.git
cd samsat-tax-OOP
```

### Step 2: Setup Backend

#### 2.1 Konfigurasi Database
1. Buka MySQL client atau MySQL Workbench
2. Buat database baru:
   ```sql
   CREATE DATABASE samsat_tax;
   ```

3. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/samsat_tax
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   spring.jpa.hibernate.ddl-auto=update
   ```

#### 2.2 Menjalankan Backend
```bash
cd backend

# Linux/Mac
./mvnw spring-boot:run

# Windows PowerShell
.\mvnw spring-boot:run
```

Backend akan berjalan di: `http://localhost:8080`

### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

### Step 4: Verifikasi Koneksi
- Buka browser dan akses `http://localhost:5173`
- Coba login atau registrasi
- Jika berhasil terhubung ke backend, sistem siap digunakan

---

## 📡 Dokumentasi API

### Base URL
```
http://localhost:8080/api
```

### 1. Autentikasi (`/auth`)

| Method | Endpoint | Deskripsi | Request Body |
|--------|----------|-----------|--------------|
| `POST` | `/auth/login` | Login otomatis | `LoginRequest` |
| `POST` | `/auth/register/warga` | Registrasi warga | `Pengguna` |
| `POST` | `/auth/register/admin` | Registrasi admin | `Admin` |

### 2. Dashboard (`/dashboard`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/dashboard/summary` | Ringkasan dashboard |

### 3. Data Masyarakat (`/pengguna`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/pengguna` | Ambil semua data |
| `GET` | `/pengguna/{id}` | Ambil by ID |
| `POST` | `/pengguna` | Tambah data |
| `DELETE` | `/pengguna/{id}` | Hapus data |

### 4. Data Kendaraan (`/kendaraan`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/kendaraan` | Ambil semua kendaraan |
| `GET` | `/kendaraan/{id}` | Ambil by ID |
| `GET` | `/kendaraan/nik/{nik}` | Ambil by NIK |
| `POST` | `/kendaraan` | Tambah kendaraan |
| `PUT` | `/kendaraan/{id}` | Edit kendaraan |
| `DELETE` | `/kendaraan/{id}` | Hapus kendaraan |

### 5. Layanan PKB (`/layanan`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/layanan` | Buat tagihan pajak |
| `GET` | `/layanan` | Ambil semua tagihan |
| `GET` | `/layanan/{id}` | Ambil by ID |
| `PUT` | `/layanan/{id}/bayar` | Bayar tagihan |

### 6. Pengaduan (`/pengaduan`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/pengaduan` | Buat pengaduan |
| `GET` | `/pengaduan` | Ambil semua pengaduan |
| `GET` | `/pengaduan/{id}` | Ambil by ID |
| `PUT` | `/pengaduan/{id}/status` | Ubah status |

---

## ⚙️ Fitur Sistem

### 1. Login Role Otomatis
Role (Admin/Masyarakat) ditentukan otomatis oleh sistem berdasarkan data akun di database. User hanya perlu memasukkan email dan password.

### 2. Sistem Denda Pajak
Fitur jatuh tempo dan denda otomatis:
```
Denda = Rp50.000 × jumlah bulan keterlambatan
Total Bayar = Nominal Tagihan + Denda

Contoh:
- Telat 1 bulan = Rp50.000
- Telat 2 bulan = Rp100.000
- Telat 3 bulan = Rp150.000
```

### 3. Proteksi Route Berdasarkan Role
- Halaman admin hanya dapat diakses admin
- Halaman masyarakat hanya dapat diakses masyarakat
- User belum login otomatis diarahkan ke login

### 4. Bukti Pembayaran Digital
Setelah pembayaran, masyarakat dapat mencetak atau menyimpan bukti pembayaran sebagai PDF

### 5. Dashboard Ringkasan
Menampilkan statistik dan metrik penting:
- Jumlah masyarakat terdaftar
- Jumlah kendaraan
- Jumlah tagihan
- Total pendapatan

---

## 🔗 Integrasi Frontend-Backend

### Alur Komunikasi
```
React Frontend (Port 5173)
    ↓
Axios Client (api.js)
    ↓
Spring Boot Backend (Port 8080)
    ↓
MySQL Database
```

### File Penghubung Utama

| Komponen | File | Deskripsi |
|----------|------|-----------|
| **FE** | `frontend/src/services/api.js` | Konfigurasi Axios base URL |
| **BE** | `application.properties` | Konfigurasi database |
| **BE** | `*Controller.java` | Endpoint REST + CORS |

### Contoh Request
```javascript
import api from "../services/api";

// GET request
const response = await api.get("/kendaraan");

// POST request
const newKendaraan = await api.post("/kendaraan", {
  nomorPolisi: "B 1234 AB",
  merk: "Toyota"
});
```

---

## ⚠️ Troubleshooting

### 1. Error `ERR_CONNECTION_REFUSED`
**Solusi:**
- ✅ Pastikan backend sudah berjalan di port 8080
- ✅ Pastikan MySQL sudah aktif
- ✅ Cek konfigurasi `application.properties`

### 2. Masalah CORS
**Solusi:**
- ✅ Pastikan `@CrossOrigin(origins = "*")` ada di Controller
- ✅ Pastikan baseURL di `api.js` sesuai backend URL

### 3. Port Bentrok
**Solusi:**
- ✅ Frontend (default: 5173) - ubah di `vite.config.js`
- ✅ Backend (default: 8080) - ubah di `application.properties`
- ✅ MySQL (default: 3306) - ubah di `application.properties`

### 4. Database Connection Failed
**Solusi:**
- ✅ Pastikan MySQL server running
- ✅ Verify username & password di `application.properties`
- ✅ Pastikan database `samsat_tax` sudah dibuat

---

## 👥 Contributors

Kontributor yang telah berkontribusi dalam pengembangan project ini:


[@Deikazen](https://github.com/Deikazen)

[@alfarezalfathir](https://github.com/alfarezalfathir) 

---

## 📚 Dokumentasi Lengkap

- **[Backend README](./backend/README.md)** - Dokumentasi lengkap backend, API endpoints, dan setup
- **[Frontend README](./frontend/README.md)** - Dokumentasi lengkap frontend, cara menjalankan, dan integrasi

---

## 🤝 Kontribusi

Kami menerima kontribusi dari komunitas. Untuk berkontribusi:

1. Fork repository ini
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 Lisensi

Project ini adalah open source dan tersedia untuk penggunaan pendidikan dan komersial.

---

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan:
- Buka [GitHub Issues](https://github.com/Deikazen/samsat-tax-OOP/issues)
- Cek dokumentasi di folder `backend/` dan `frontend/`

---

**Last Updated:** 2026  
**Version:** 1.0.0
