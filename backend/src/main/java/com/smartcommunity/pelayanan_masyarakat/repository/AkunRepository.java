package com.smartcommunity.pelayanan_masyarakat.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.smartcommunity.pelayanan_masyarakat.model.Akun;

@Repository
public interface AkunRepository extends JpaRepository<Akun, Long> {

    // Dari diagrammu: mencari berdasarkan email (bisa Warga, bisa Admin)
    Optional<Akun> findByEmail(String email);

    // Dari diagrammu: mencari berdasarkan nama
    List<Akun> findByNama(String nama);

    @Query("SELECT COUNT(a) FROM Akun a WHERE TYPE(a) = Pengguna")
    long countPengguna();

}
