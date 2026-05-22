# Pelayanan Masyarakat API

Proyek ini adalah sistem backend layanan masyarakat berbasis Spring Boot yang menyediakan antarmuka REST API untuk autentikasi, layanan pajak (PKB), pengaduan masyarakat, serta dashboard.

## Teknologi yang Digunakan
- Java 21
- Spring Boot 4.0.6
- Spring Data JPA
- Spring Web
- MySQL Driver
- Lombok

## Dokumentasi Endpoint API

Berikut adalah daftar endpoint API yang tersedia pada sistem ini:

### 1. Autentikasi (`/api/auth`)
Digunakan untuk proses pendaftaran dan login, baik untuk warga (pengguna) maupun admin.

| Method | Endpoint | Deskripsi | Request Body |
|--------|----------|-----------|--------------|
| `POST` | `/api/auth/register/warga` | Mendaftarkan akun warga baru | `Pengguna` |
| `POST` | `/api/auth/login/warga` | Login untuk warga | `Pengguna` |
| `POST` | `/api/auth/register/admin` | Mendaftarkan akun admin baru | `Admin` |
| `POST` | `/api/auth/login/admin` | Login untuk admin | `Admin` |

### 2. Dashboard (`/api/dashboard`)
Digunakan untuk mendapatkan ringkasan data atau metrik pada dashboard.

| Method | Endpoint | Deskripsi | Response |
|--------|----------|-----------|----------|
| `GET` | `/api/dashboard/summary` | Mengambil data ringkasan dashboard | `Map<String, Object>` |

### 3. Layanan PKB (`/api/layanan`)
Digunakan untuk mengelola pengajuan layanan (contoh: Pajak Kendaraan Bermotor / PKB).

| Method | Endpoint | Deskripsi | Request Body / Param |
|--------|----------|-----------|----------------------|
| `POST` | `/api/layanan` | Membuat pengajuan layanan baru | `LayananPKB` |
| `GET` | `/api/layanan` | Mengambil semua data pengajuan layanan | - |
| `GET` | `/api/layanan/{id}` | Mengambil data pengajuan layanan berdasarkan ID | `id` (Path Variable) |

### 4. Pengaduan Masyarakat (`/api/pengaduan`)
Digunakan untuk mengelola sistem pelaporan atau pengaduan dari masyarakat.

| Method | Endpoint | Deskripsi | Request Body / Param |
|--------|----------|-----------|----------------------|
| `POST` | `/api/pengaduan` | Membuat pengajuan pengaduan baru | `Pengaduan` |
| `GET` | `/api/pengaduan` | Mengambil semua data pengaduan | - |
| `GET` | `/api/pengaduan/{id}` | Mengambil detail pengaduan berdasarkan ID | `id` (Path Variable) |
| `PUT` | `/api/pengaduan/{id}/status` | Mengubah status suatu pengaduan (misal: oleh Admin) | `id` (Path Var), `status` (Query Param) |

## Cara Menjalankan Secara Lokal
1. Pastikan Anda telah menginstal Java 21 dan MySQL.
2. Konfigurasi database Anda di dalam file `application.properties` atau `application.yml` sesuai dengan kredensial MySQL lokal Anda.
3. Jalankan aplikasi menggunakan Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Aplikasi akan berjalan di port default `8080` (kecuali dikonfigurasi berbeda di properties).
