package com.smartcommunity.pelayanan_masyarakat.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin extends Akun {

    @Column(nullable = false, unique = true, length = 20)
    private String nip; // Nomor Induk Pegawai

    public String getNip() {
        return nip;
    }

    public void setNip(String nip) {
        if (nip == null || nip.trim().isEmpty()) {
            throw new IllegalArgumentException("NIP tidak boleh kosong!");
        }
        this.nip = nip;
    }

    // Implementasi method abstract (Polymorphism)
    @Override
    public boolean login() {
        this.setLastLogin(java.time.LocalDateTime.now());
        this.setLoginCount((this.getLoginCount() == null ? 0 : this.getLoginCount()) + 1);
        System.out.println(">>> [AUDIT LOG]: Administrator " + getNama() + " (NIP: " + nip + ") logged in successfully.");
        System.out.println("    Login Count: " + this.getLoginCount() + " | Timestamp: " + this.getLastLogin());
        return true;
    }
}
