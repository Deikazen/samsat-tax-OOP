package com.smartcommunity.pelayanan_masyarakat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartcommunity.pelayanan_masyarakat.model.Pengaduan;

@Repository
public interface PengaduanRepository extends JpaRepository<Pengaduan, Long> {

    // Custom query: Mencari semua pengaduan yang dibuat oleh 1 pengguna tertentu
    List<Pengaduan> findByPenggunaId(Long penggunaId);

    // Custom query: Mencari pengaduan berdasarkan status (MENUNGGU, DIPROSES, dll)
    List<Pengaduan> findByStatus(String status);
}
