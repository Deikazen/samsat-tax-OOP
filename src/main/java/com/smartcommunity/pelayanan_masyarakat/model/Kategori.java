package com.smartcommunity.pelayanan_masyarakat.model;

import jakarta.persistence.*;

@Entity
@Table(name = "kategori")
public class Kategori extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String namaKategori;

    @Column(length = 500)
    private String deskripsi;

    public String getNamaKategori() {
        return namaKategori;
    }

    public void setNamaKategori(String namaKategori) {
        if (namaKategori == null || namaKategori.trim().isEmpty()) {
            throw new IllegalArgumentException("Nama kategori wajib diisi!");
        }
        this.namaKategori = namaKategori;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }
}
