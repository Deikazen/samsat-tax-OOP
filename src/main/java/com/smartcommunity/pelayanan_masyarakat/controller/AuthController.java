package com.smartcommunity.pelayanan_masyarakat.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smartcommunity.pelayanan_masyarakat.dto.LoginRequest;
import com.smartcommunity.pelayanan_masyarakat.model.Admin;
import com.smartcommunity.pelayanan_masyarakat.model.Akun;
import com.smartcommunity.pelayanan_masyarakat.model.Pengguna;
import com.smartcommunity.pelayanan_masyarakat.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================
    // LOGIN BARU
    // =========================
    // User tidak memilih role.
    // Backend yang menentukan role berdasarkan data akun di database.
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Akun akunLogin = authService.login(request.getEmail(), request.getPassword());

        Map<String, Object> response = new HashMap<>();

        response.put("id", akunLogin.getId());
        response.put("nama", akunLogin.getNama());
        response.put("email", akunLogin.getEmail());

        if (akunLogin instanceof Admin admin) {
            response.put("role", "ADMIN");
            response.put("nip", admin.getNip());
        } else if (akunLogin instanceof Pengguna pengguna) {
            response.put("role", "MASYARAKAT");
            response.put("nik", pengguna.getNik());
            response.put("alamat", pengguna.getAlamat());
            response.put("noHp", pengguna.getNoHp());
        }

        return ResponseEntity.ok(response);
    }

    // =========================
    // REGISTER WARGA
    // =========================
    // User hanya daftar sebagai masyarakat.
    // Role tidak dipilih manual dari halaman login.
    @PostMapping("/register/warga")
    public ResponseEntity<Pengguna> registerWarga(@RequestBody Pengguna pengguna) {
        Pengguna wargaBaru = authService.registerPengguna(pengguna);
        return new ResponseEntity<>(wargaBaru, HttpStatus.CREATED);
    }

    // =========================
    // REGISTER ADMIN
    // =========================
    // Endpoint ini sebaiknya hanya dipakai admin/sistem,
    // bukan ditampilkan bebas ke user biasa.
    @PostMapping("/register/admin")
    public ResponseEntity<Admin> registerAdmin(@RequestBody Admin admin) {
        Admin adminBaru = authService.registerAdmin(admin);
        return new ResponseEntity<>(adminBaru, HttpStatus.CREATED);
    }

    // =========================
    // LOGIN LAMA
    // =========================
    // Bagian ini boleh dibiarkan dulu supaya fitur lama tidak langsung rusak.
    // Tapi nanti frontend cukup pakai /api/auth/login saja.

    @PostMapping("/login/warga")
    public ResponseEntity<Pengguna> loginWarga(@RequestBody Pengguna pengguna) {
        Pengguna wargaLogedIn = authService.loginPengguna(pengguna);
        return ResponseEntity.ok(wargaLogedIn);
    }

    @PostMapping("/login/admin")
    public ResponseEntity<Admin> loginAdmin(@RequestBody Admin admin) {
        Admin adminLogedIn = authService.loginAdmin(admin);
        return ResponseEntity.ok(adminLogedIn);
    }
}