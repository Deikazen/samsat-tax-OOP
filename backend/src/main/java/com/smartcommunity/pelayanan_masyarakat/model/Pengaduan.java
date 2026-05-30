package com.smartcommunity.pelayanan_masyarakat.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

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

    @ManyToMany
    @JoinTable(
            name = "pengaduan_kategori", // Nama tabel perantara yang akan dibuat otomatis
            joinColumns = @JoinColumn(name = "pengaduan_id"),
            inverseJoinColumns = @JoinColumn(name = "kategori_id")
    )
    private List<Kategori> listKategori;

    @Column(columnDefinition = "TEXT")
    private String tanggapanAdm;

    // Tambahkan getter/setter-nya
    public String getTanggapanAdm() {
        return tanggapanAdm;
    }

    public void setTanggapanAdm(String tanggapanAdm) {
        this.tanggapanAdm = tanggapanAdm;
    }

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

    public List<Kategori> getListKategori() {
        return listKategori;
    }

    public void setListKategori(List<Kategori> listKategori) {
        this.listKategori = listKategori;
    }
}
