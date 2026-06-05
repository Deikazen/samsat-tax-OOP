package com.smartcommunity.pelayanan_masyarakat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcommunity.pelayanan_masyarakat.exception.DataTidakDitemukanException;
import com.smartcommunity.pelayanan_masyarakat.model.Admin;
import com.smartcommunity.pelayanan_masyarakat.repository.AdminRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminRepository adminRepository;

    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmin() {
        return ResponseEntity.ok(adminRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() ->
                        new DataTidakDitemukanException("Admin tidak ditemukan"));

        return ResponseEntity.ok(admin);
    }

    @PostMapping
    public ResponseEntity<Admin> tambahAdmin(@RequestBody Admin admin) {
        Admin savedAdmin = adminRepository.save(admin);
        return ResponseEntity.ok(savedAdmin);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(
            @PathVariable Long id,
            @RequestBody Admin dataBaru) {

        Admin admin = adminRepository.findById(id)
                .orElseThrow(() ->
                        new DataTidakDitemukanException("Admin tidak ditemukan"));

        admin.setNama(dataBaru.getNama());
        admin.setEmail(dataBaru.getEmail());
        admin.setNip(dataBaru.getNip());

        if (dataBaru.getPassword() != null
                && !dataBaru.getPassword().isBlank()) {
            admin.setPassword(dataBaru.getPassword());
        }

        return ResponseEntity.ok(adminRepository.save(admin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> hapusAdmin(@PathVariable Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() ->
                        new DataTidakDitemukanException("Admin tidak ditemukan"));

        if (adminRepository.count() <= 1) {
            throw new IllegalArgumentException(
                    "Admin terakhir tidak boleh dihapus!");
        }

        adminRepository.delete(admin);

        return ResponseEntity.ok("Data admin berhasil dihapus");
    }
}