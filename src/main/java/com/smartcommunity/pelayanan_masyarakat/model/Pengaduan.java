package com.smartcommunity.pelayanan_masyarakat.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pengaduan")
public class Pengaduan extends BaseEntity {

    @Column(nullable = false)
    private String judul;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String deskripsi;

    @Column(nullable = false)
    private String status = "MENUNGGU"; // Nilai default

    // Relasi Many-to-One (Banyak pengaduan bisa dimiliki 1 pengguna)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pengguna_id", nullable = false)
    private Pengguna pengguna;

    // Relasi Many-to-One (Banyak pengaduan bisa masuk ke 1 kategori)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kategori_id", nullable = false)
    private Kategori kategori;

    public String getJudul() {
        return judul;
    }

    public void setJudul(String judul) {
        if (judul == null || judul.trim().isEmpty()) {
            throw new IllegalArgumentException("Judul pengaduan tidak boleh kosong!");
        }
        this.judul = judul;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        if (deskripsi == null || deskripsi.length() < 10) {
            throw new IllegalArgumentException("Deskripsi terlalu singkat (minimal 10 karakter)!");
        }
        this.deskripsi = deskripsi;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Pengguna getPengguna() {
        return pengguna;
    }

    public void setPengguna(Pengguna pengguna) {
        this.pengguna = pengguna;
    }

    public Kategori getKategori() {
        return kategori;
    }

    public void setKategori(Kategori kategori) {
        this.kategori = kategori;
    }
}
