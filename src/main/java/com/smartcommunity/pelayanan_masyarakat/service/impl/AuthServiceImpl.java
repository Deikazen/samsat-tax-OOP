package com.smartcommunity.pelayanan_masyarakat.service.impl;

import com.smartcommunity.pelayanan_masyarakat.exception.DataTidakDitemukanException;
import com.smartcommunity.pelayanan_masyarakat.model.Admin;
import com.smartcommunity.pelayanan_masyarakat.model.Pengguna;
import com.smartcommunity.pelayanan_masyarakat.repository.AdminRepository;
import com.smartcommunity.pelayanan_masyarakat.repository.PenggunaRepository;
import com.smartcommunity.pelayanan_masyarakat.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final PenggunaRepository penggunaRepo;
    private final AdminRepository adminRepo;

    public AuthServiceImpl(PenggunaRepository penggunaRepo, AdminRepository adminRepo) {
        this.penggunaRepo = penggunaRepo;
        this.adminRepo = adminRepo;
    }

    @Override
    public Pengguna registerPengguna(Pengguna pengguna) {
        // Bisa tambahkan pengecekan apakah email/NIK sudah ada
        return penggunaRepo.save(pengguna);
    }

    @Override
    public Admin registerAdmin(Admin admin) {
        return adminRepo.save(admin);
    }

    @Override
    public Pengguna loginPengguna(Pengguna pengguna) {
        Pengguna userDb = penggunaRepo.findByEmail(pengguna.getEmail())
                .orElseThrow(() -> new DataTidakDitemukanException("Email warga tidak terdaftar!"));

        if (!userDb.getPassword().equals(pengguna.getPassword())) {
            throw new IllegalArgumentException("Password warga salah!");
        }

        userDb.login(); // Pemanggilan method polymorphism
        return userDb;
    }

    @Override
    public Admin loginAdmin(Admin admin) {
        // Asumsi kamu membuat method findByEmail di AdminRepository
        Admin adminDb = adminRepo.findByEmail(admin.getEmail())
                .orElseThrow(() -> new DataTidakDitemukanException("Email admin tidak terdaftar!"));

        if (!adminDb.getPassword().equals(admin.getPassword())) {
            throw new IllegalArgumentException("Password admin salah!");
        }

        adminDb.login(); // Pemanggilan method polymorphism
        return adminDb;
    }
}
