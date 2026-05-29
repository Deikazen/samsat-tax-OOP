package com.smartcommunity.pelayanan_masyarakat.service.impl;

import org.springframework.stereotype.Service;

import com.smartcommunity.pelayanan_masyarakat.exception.DataTidakDitemukanException;
import com.smartcommunity.pelayanan_masyarakat.model.Admin;
import com.smartcommunity.pelayanan_masyarakat.model.Akun;
import com.smartcommunity.pelayanan_masyarakat.model.Pengguna;
import com.smartcommunity.pelayanan_masyarakat.repository.AkunRepository;
import com.smartcommunity.pelayanan_masyarakat.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final AkunRepository akunRepo;

    public AuthServiceImpl(AkunRepository akunRepo) {
        this.akunRepo = akunRepo;
    }

    // Login baru:
    // Tidak perlu pilih role, cukup email dan password.
    // Role dicek otomatis dari tipe data akun di database.
    @Override
    public Akun login(String email, String password) {
        Akun akunDb = akunRepo.findByEmail(email)
                .orElseThrow(() -> new DataTidakDitemukanException("Email tidak terdaftar!"));

        if (!akunDb.getPassword().equals(password)) {
            throw new IllegalArgumentException("Password salah!");
        }

        akunDb.login();
        return akunDb;
    }

    @Override
    public Pengguna registerPengguna(Pengguna pengguna) {
        return akunRepo.save(pengguna);
    }

    @Override
    public Admin registerAdmin(Admin admin) {
        return akunRepo.save(admin);
    }

    // Login lama untuk warga.
    // Boleh tetap ada biar endpoint lama tidak rusak.
    @Override
    public Pengguna loginPengguna(Pengguna pengguna) {
        Akun akunDb = akunRepo.findByEmail(pengguna.getEmail())
                .orElseThrow(() -> new DataTidakDitemukanException("Email warga tidak terdaftar!"));

        if (!akunDb.getPassword().equals(pengguna.getPassword())) {
            throw new IllegalArgumentException("Password warga salah!");
        }

        if (!(akunDb instanceof Pengguna)) {
            throw new IllegalArgumentException("Akun ini bukan akun masyarakat!");
        }

        akunDb.login();
        return (Pengguna) akunDb;
    }

    // Login lama untuk admin.
    // Boleh tetap ada biar endpoint lama tidak rusak.
    @Override
    public Admin loginAdmin(Admin admin) {
        Akun akunDb = akunRepo.findByEmail(admin.getEmail())
                .orElseThrow(() -> new DataTidakDitemukanException("Email admin tidak terdaftar!"));

        if (!akunDb.getPassword().equals(admin.getPassword())) {
            throw new IllegalArgumentException("Password admin salah!");
        }

        if (!(akunDb instanceof Admin)) {
            throw new IllegalArgumentException("Akun ini bukan akun admin!");
        }

        akunDb.login();
        return (Admin) akunDb;
    }
}