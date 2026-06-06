package com.smartcommunity.pelayanan_masyarakat.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore; // agar ga looping

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

    @Column(length = 255)
    private String alamat;

    @Column(length = 20)
    private String noHp;

    // Relasi One-to-Many (1 Pengguna bisa membuat banyak Pengaduan)
    @JsonIgnore // agar ga looping
    @OneToMany(mappedBy = "pengguna", cascade = CascadeType.ALL)
    private List<Pengaduan> listPengaduan;

    @JsonIgnore  // agar ga looping
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

    public String getAlamat() {
        return alamat;
    }

    public void setAlamat(String alamat) {
        this.alamat = alamat;
    }

    public String getNoHp() {
        return noHp;
    }

    public void setNoHp(String noHp) {
        this.noHp = noHp;
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
        this.setLastLogin(java.time.LocalDateTime.now());
        this.setLoginCount((this.getLoginCount() == null ? 0 : this.getLoginCount()) + 1);
        System.out.println(">>> [LOG]: Warga " + getNama() + " (NIK: " + nik + ") logged in.");
        System.out.println("    Login Count: " + this.getLoginCount() + " | Timestamp: " + this.getLastLogin());
        
        // Logika bisnis tambahan: mengecek status pengaduan dan kendaraan pengguna
        try {
            int totalPengaduan = (this.listPengaduan != null) ? this.listPengaduan.size() : 0;
            long pengaduanMenunggu = (this.listPengaduan != null)
                ? this.listPengaduan.stream().filter(p -> "MENUNGGU".equals(p.getStatus())).count()
                : 0;
            System.out.println("    [INFO PENGADUAN] Total Pengaduan: " + totalPengaduan + " | Menunggu Tanggapan: " + pengaduanMenunggu);
        } catch (Exception e) {
            System.out.println("    [INFO PENGADUAN] Data pengaduan belum dimuat (Lazy Load).");
        }

        try {
            int totalKendaraan = (this.listKendaraan != null) ? this.listKendaraan.size() : 0;
            System.out.println("    [INFO KENDARAAN] Jumlah Kendaraan Terdaftar: " + totalKendaraan);
        } catch (Exception e) {
            System.out.println("    [INFO KENDARAAN] Data kendaraan belum dimuat (Lazy Load).");
        }

        return true;
    }
}