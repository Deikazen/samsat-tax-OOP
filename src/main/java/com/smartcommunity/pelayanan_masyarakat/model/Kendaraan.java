package com.smartcommunity.pelayanan_masyarakat.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "kendaraan")
public class Kendaraan extends BaseEntity {

    @Column(nullable = false, unique = true, length = 20)
    private String platNomor;

    @Column(nullable = false, length = 50)
    private String merek;

    // Relasi Many-to-One ke Pengguna
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pengguna_id", nullable = false)
    private Pengguna pengguna;

    // --- Encapsulation ---
    public String getPlatNomor() {
        return platNomor;
    }

    public void setPlatNomor(String platNomor) {
        if (platNomor == null || platNomor.trim().isEmpty()) {
            throw new IllegalArgumentException("Plat nomor tidak boleh kosong!");
        }
        // Bisa tambah logika hapus spasi, misal: D 1234 ABC jadi D1234ABC
        this.platNomor = platNomor.replace(" ", "").toUpperCase();
    }

    public String getMerek() {
        return merek;
    }

    public void setMerek(String merek) {
        if (merek == null || merek.trim().isEmpty()) {
            throw new IllegalArgumentException("Merek kendaraan wajib diisi!");
        }
        this.merek = merek;
    }

    public Pengguna getPengguna() {
        return pengguna;
    }

    public void setPengguna(Pengguna pengguna) {
        this.pengguna = pengguna;
    }
}
