package com.smartcommunity.pelayanan_masyarakat.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartcommunity.pelayanan_masyarakat.model.Kategori;

@Repository
public interface KategoriRepository extends JpaRepository<Kategori, Long> {

    // Custom query: Mencari kategori dari namanya (misal: "Infrastruktur")
    Optional<Kategori> findByNamaKategori(String namaKategori);

}
