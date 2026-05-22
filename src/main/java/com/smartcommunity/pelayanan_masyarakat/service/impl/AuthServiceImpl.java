package com.smartcommunity.pelayanan_masyarakat.service.impl;

import com.smartcommunity.pelayanan_masyarakat.exception.DataTidakDitemukanException;
import com.smartcommunity.pelayanan_masyarakat.model.Admin;
import com.smartcommunity.pelayanan_masyarakat.model.Akun;
import com.smartcommunity.pelayanan_masyarakat.model.Pengguna;
import com.smartcommunity.pelayanan_masyarakat.repository.AkunRepository; // Menggunakan 1 repo tunggal
import com.smartcommunity.pelayanan_masyarakat.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AkunRepository akunRepo;

    public AuthServiceImpl(AkunRepository akunRepo) {
        this.akunRepo = akunRepo;
    }

    @Override
    public Pengguna registerPengguna(Pengguna pengguna) {
        return akunRepo.save(pengguna); // Polymorphism: Menerima class anak
    }

    @Override
    public Admin registerAdmin(Admin admin) {
        return akunRepo.save(admin);
    }

    @Override
    public Pengguna loginPengguna(Pengguna pengguna) {
        Akun akunDb = akunRepo.findByEmail(pengguna.getEmail())
                .orElseThrow(() -> new DataTidakDitemukanException("Email warga tidak terdaftar!"));

        if (!akunDb.getPassword().equals(pengguna.getPassword())) {
            throw new IllegalArgumentException("Password warga salah!");
        }

        akunDb.login();
        return (Pengguna) akunDb; // WAJIB DI-CASTING KE PENGGUNA
    }

    @Override
    public Admin loginAdmin(Admin admin) {
        Akun akunDb = akunRepo.findByEmail(admin.getEmail())
                .orElseThrow(() -> new DataTidakDitemukanException("Email admin tidak terdaftar!"));

        if (!akunDb.getPassword().equals(admin.getPassword())) {
            throw new IllegalArgumentException("Password admin salah!");
        }

        akunDb.login();
        return (Admin) akunDb; // WAJIB DI-CASTING KE ADMIN
    }
}
