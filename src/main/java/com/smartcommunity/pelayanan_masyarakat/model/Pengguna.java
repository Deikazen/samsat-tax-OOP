package com.smartcommunity.pelayanan_masyarakat.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "pengguna")
public class Pengguna extends Akun {

    @Column(nullable = false, unique = true, length = 16)
    private String nik;

    // Relasi One-to-Many (1 Pengguna bisa membuat banyak Pengaduan)
    @OneToMany(mappedBy = "pengguna", cascade = CascadeType.ALL)
    private List<Pengaduan> listPengaduan;

    @OneToMany(mappedBy = "pengguna", cascade = CascadeType.ALL)
    private List<Kendaraan> listKendaraan;

    public List<Kendaraan> getListKendaraan() {
        return listKendaraan;
    }

    public void setListKendaraan(List<Kendaraan> listKendaraan) {
        this.listKendaraan = listKendaraan;
    }

    public String getNik() {
        return nik;
    }

    public void setNik(String nik) {
        if (nik == null || nik.length() != 16) {
            throw new IllegalArgumentException("NIK harus tepat 16 digit!");
        }
        this.nik = nik;
    }

    public List<Pengaduan> getListPengaduan() {
        return listPengaduan;
    }

    public void setListPengaduan(List<Pengaduan> listPengaduan) {
        this.listPengaduan = listPengaduan;
    }

    // Implementasi method abstract (Polymorphism)
    @Override
    public boolean login() {
        System.out.println("Login sebagai pengguna warga masyarakat...");
        return true;
    }
}
