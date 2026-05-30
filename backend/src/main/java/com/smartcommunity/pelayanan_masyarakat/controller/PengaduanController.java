package com.smartcommunity.pelayanan_masyarakat.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcommunity.pelayanan_masyarakat.model.Pengaduan;
import com.smartcommunity.pelayanan_masyarakat.service.PengaduanService;

@RestController
@RequestMapping("/api/pengaduan")
@CrossOrigin(origins = "*") // Mengizinkan React Frontend di Vercel untuk mengakses API ini
public class PengaduanController {

    private final PengaduanService pengaduanService;

    // Dependency Injection sesuai arsitektur
    public PengaduanController(PengaduanService pengaduanService) {
        this.pengaduanService = pengaduanService;
    }

    @PostMapping
    public ResponseEntity<Pengaduan> buatPengajuanPengaduan(@RequestBody Pengaduan pengadu) {
        Pengaduan pengaduanBaru = pengaduanService.ajukanPengaduan(pengadu);
        return new ResponseEntity<>(pengaduanBaru, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Pengaduan>> getAllPengaduan() {
        List<Pengaduan> listPengaduan = pengaduanService.getAllPengaduan();
        return ResponseEntity.ok(listPengaduan);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pengaduan> getPengaduanById(@PathVariable Long id) {
        Pengaduan pengaduan = pengaduanService.getPengaduanById(id);
        return ResponseEntity.ok(pengaduan);
    }

    // Endpoint tambahan untuk mengubah status pengaduan (misal oleh Admin)
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestParam String status) {
        pengaduanService.updateStatusPengaduan(id, status);
        return ResponseEntity.ok("Status pengaduan berhasil diubah menjadi: " + status);
    }
}
