package com.smartcommunity.pelayanan_masyarakat.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartcommunity.pelayanan_masyarakat.model.Pengguna;

@Repository
public interface PenggunaRepository extends JpaRepository<Pengguna, Long> {
    Optional<Pengguna> findByNik(String nik);
}