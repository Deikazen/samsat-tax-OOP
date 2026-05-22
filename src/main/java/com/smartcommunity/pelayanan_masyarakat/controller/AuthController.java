package com.smartcommunity.pelayanan_masyarakat.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcommunity.pelayanan_masyarakat.model.Admin;
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

    // --- ENDPOINT UNTUK WARGA (PENGGUNA) ---
    @PostMapping("/register/warga")
    public ResponseEntity<Pengguna> registerWarga(@RequestBody Pengguna pengguna) {
        Pengguna wargaBaru = authService.registerPengguna(pengguna);
        return new ResponseEntity<>(wargaBaru, HttpStatus.CREATED);
    }

    @PostMapping("/login/warga")
    public ResponseEntity<Pengguna> loginWarga(@RequestBody Pengguna pengguna) {
        Pengguna wargaLogedIn = authService.loginPengguna(pengguna);
        return ResponseEntity.ok(wargaLogedIn);
    }

    // --- ENDPOINT UNTUK ADMIN ---
    @PostMapping("/register/admin")
    public ResponseEntity<Admin> registerAdmin(@RequestBody Admin admin) {
        Admin adminBaru = authService.registerAdmin(admin);
        return new ResponseEntity<>(adminBaru, HttpStatus.CREATED);
    }

    @PostMapping("/login/admin")
    public ResponseEntity<Admin> loginAdmin(@RequestBody Admin admin) {
        Admin adminLogedIn = authService.loginAdmin(admin);
        return ResponseEntity.ok(adminLogedIn);
    }
}
