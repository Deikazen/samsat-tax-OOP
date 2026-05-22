package com.smartcommunity.pelayanan_masyarakat.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.smartcommunity.pelayanan_masyarakat.model.Admin;
import com.smartcommunity.pelayanan_masyarakat.model.Akun;
import com.smartcommunity.pelayanan_masyarakat.model.Kategori;
import com.smartcommunity.pelayanan_masyarakat.model.Kendaraan;
import com.smartcommunity.pelayanan_masyarakat.model.LayananPKB;
import com.smartcommunity.pelayanan_masyarakat.model.Pengaduan;
import com.smartcommunity.pelayanan_masyarakat.model.Pengguna;
import com.smartcommunity.pelayanan_masyarakat.repository.AkunRepository;
import com.smartcommunity.pelayanan_masyarakat.repository.KategoriRepository;
import com.smartcommunity.pelayanan_masyarakat.repository.KendaraanRepository;
import com.smartcommunity.pelayanan_masyarakat.repository.LayananRepository;
import com.smartcommunity.pelayanan_masyarakat.repository.PengaduanRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AkunRepository akunRepo;
    private final KategoriRepository kategoriRepo;
    private final KendaraanRepository kendaraanRepo;
    private final LayananRepository layananRepo;
    private final PengaduanRepository pengaduanRepo;

    // Dependency Injection kelima Repository
    public DataSeeder(AkunRepository akunRepo,
            KategoriRepository kategoriRepo,
            KendaraanRepository kendaraanRepo,
            LayananRepository layananRepo,
            PengaduanRepository pengaduanRepo) {
        this.akunRepo = akunRepo;
        this.kategoriRepo = kategoriRepo;
        this.kendaraanRepo = kendaraanRepo;
        this.layananRepo = layananRepo;
        this.pengaduanRepo = pengaduanRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=========================================");
        System.out.println("🌱 Memulai Eksekusi Full Database Seeder...");

        // 1. SEEDING KATEGORI
        if (kategoriRepo.count() == 0) {
            Kategori kat1 = new Kategori();
            kat1.setNamaKategori("Infrastruktur");
            kat1.setDeskripsi("Pengaduan jalan rusak, jembatan, fasilitas umum.");

            Kategori kat2 = new Kategori();
            kat2.setNamaKategori("Lalu Lintas");
            kat2.setDeskripsi("Lampu lalu lintas mati, rambu rusak, kemacetan.");

            Kategori kat3 = new Kategori();
            kat3.setNamaKategori("Keamanan");
            kat3.setDeskripsi("Gangguan ketertiban dan keamanan lingkungan.");

            kategoriRepo.saveAll(List.of(kat1, kat2, kat3));
            System.out.println("✅ [1/5] Kategori berhasil di-seed.");
        }

        // 2. SEEDING AKUN
        if (akunRepo.count() == 0) {
            Admin admin = new Admin();
            admin.setNama("Administrator Pusat");
            admin.setEmail("admin@samsat.go.id");
            admin.setPassword("admin123");
            admin.setNip("198001012005011001");
            akunRepo.save(admin);

            Pengguna warga = new Pengguna();
            warga.setNama("Satria Radja");
            warga.setEmail("satria@mail.com");
            warga.setPassword("rahasia123");
            warga.setNik("3201234567890001");
            akunRepo.save(warga);
            System.out.println("✅ [2/5] Akun (Admin & Warga) berhasil di-seed.");
        }

        // 3. SEEDING KENDARAAN (Relasi ke Pengguna)
        if (kendaraanRepo.count() == 0) {
            // Tarik data pengguna yang baru saja dibuat
            Akun akun = akunRepo.findByEmail("satria@mail.com").orElse(null);

            if (akun instanceof Pengguna) {
                Kendaraan motor = new Kendaraan();
                motor.setPlatNomor("D 1234 ABC");
                motor.setMerek("Honda Vario 150");
                motor.setPengguna((Pengguna) akun); // Set Relasi
                kendaraanRepo.save(motor);
                System.out.println("✅ [3/5] Kendaraan berhasil di-seed dan direlasikan ke Warga.");
            }
        }

        // 4. SEEDING LAYANAN PKB (Relasi ke Kendaraan)
        if (layananRepo.count() == 0) {
            // Tarik data kendaraan yang baru dibuat
            Kendaraan kendaraanDb = kendaraanRepo.findByPlatNomor("D 1234 ABC").orElse(null);

            if (kendaraanDb != null) {
                LayananPKB pkb = new LayananPKB();
                pkb.setTahunPajak(2026);
                pkb.setNominalTagihan(250000.0);
                pkb.setStatusLayanan("MENUNGGU_PEMBAYARAN");
                pkb.setKendaraan(kendaraanDb); // Set Relasi
                layananRepo.save(pkb);
                System.out.println("✅ [4/5] Layanan PKB berhasil di-seed dan direlasikan ke Kendaraan.");
            }
        }

        // 5. SEEDING PENGADUAN (Relasi ke Pengguna & Banyak Kategori)
        if (pengaduanRepo.count() == 0) {
            Akun akun = akunRepo.findByEmail("satria@mail.com").orElse(null);
            List<Kategori> semuaKategori = kategoriRepo.findAll();

            if (akun instanceof Pengguna && !semuaKategori.isEmpty()) {
                Pengaduan pengaduan = new Pengaduan();
                pengaduan.setJudul("Lampu Jalan Mati di Lembang");
                pengaduan.setDeskripsi("Lampu penerangan jalan utama mati total, sangat membahayakan pengendara motor di malam hari.");
                pengaduan.setStatus("MENUNGGU");
                pengaduan.setPengguna((Pengguna) akun); // Set Relasi Pengguna (N:1)

                // Set Relasi Kategori (Many-to-Many)
                // Kita masukkan pengaduan ini ke dalam 2 kategori: Infrastruktur & Lalu Lintas
                List<Kategori> kategoriDipilih = semuaKategori.subList(0, 2);
                pengaduan.setListKategori(kategoriDipilih);

                pengaduanRepo.save(pengaduan);
                System.out.println("✅ [5/5] Pengaduan berhasil di-seed dengan relasi Many-to-Many ke Kategori.");
            }
        }

        System.out.println("🌲 SELURUH PROSES SEEDING SELESAI! APLIKASI SIAP DIUJI.");
        System.out.println("=========================================");
    }
}
