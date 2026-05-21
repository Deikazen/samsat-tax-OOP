package com.smartcommunity.pelayanan_masyarakat.model;

import jakarta.persistence.*;

@Entity
@Table(name = "akun")
@Inheritance(strategy = InheritanceType.JOINED)

public abstract class Akun extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String nama;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        if (nama == null || nama.trim().isEmpty()) {
            throw new IllegalArgumentException("Nama tidak boleh kosong!");
        }
        this.nama = nama;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Format email tidak valid!");
        }
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Password minimal 6 karakter!");
        }
        this.password = password;
    }

    // polymorfisme
    public abstract boolean login();

}
