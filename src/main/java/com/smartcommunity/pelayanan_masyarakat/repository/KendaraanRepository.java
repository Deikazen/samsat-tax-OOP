package com.smartcommunity.pelayanan_masyarakat.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartcommunity.pelayanan_masyarakat.model.Kendaraan;

@Repository
public interface KendaraanRepository extends JpaRepository<Kendaraan, Long> {

    // Custom query: Mencari kendaraan spesifik menggunakan plat nomor
    Optional<Kendaraan> findByPlatNomor(String platNomor);

    // Custom query: Mencari semua kendaraan milik 1 NIK tertentu
    List<Kendaraan> findByPenggunaNik(String nik);
}
