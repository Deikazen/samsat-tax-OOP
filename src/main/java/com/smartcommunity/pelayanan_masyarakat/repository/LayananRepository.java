package com.smartcommunity.pelayanan_masyarakat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartcommunity.pelayanan_masyarakat.model.LayananPKB;

@Repository
public interface LayananRepository extends JpaRepository<LayananPKB, Long> {

    // Custom query: Mencari layanan berdasarkan status (misal: "BELUM_DIBAYAR")
    List<LayananPKB> findByStatusLayanan(String statusLayanan);

    // Custom query rantai: Layanan -> Kendaraan -> Pengguna -> NIK
    // Spring Boot sangat pintar, ia akan otomatis membuatkan operasi JOIN ke 3 tabel ini!
    List<LayananPKB> findByKendaraanPenggunaNik(String nik);
}
