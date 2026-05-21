package com.smartcommunity.pelayanan_masyarakat.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "kategori")
public class Kategori extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String namaKategori;

    @Column(length = 500)
    private String deskripsi;

    @ManyToMany(mappedBy = "listKategori")
    private List<Pengaduan> listPengaduan;

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

    public List<Pengaduan> getListPengaduan() {
        return listPengaduan;
    }

    public void setListPengaduan(List<Pengaduan> listPengaduan) {
        this.listPengaduan = listPengaduan;
    }
}
