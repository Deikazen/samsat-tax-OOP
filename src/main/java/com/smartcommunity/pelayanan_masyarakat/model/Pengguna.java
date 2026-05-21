package com.smartcommunity.pelayanan_masyarakat.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "pengguna")
public class Pengguna extends Akun {

    @Column(nullable = false, unique = true, length = 16)
    private String nik;

    // Relasi One-to-Many (1 Pengguna bisa membuat banyak Pengaduan)
    @OneToMany(mappedBy = "pengguna", cascade = CascadeType.ALL)
    private List<Pengaduan> listPengaduan;

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
