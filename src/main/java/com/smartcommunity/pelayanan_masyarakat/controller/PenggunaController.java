package com.smartcommunity.pelayanan_masyarakat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcommunity.pelayanan_masyarakat.exception.DataTidakDitemukanException;
import com.smartcommunity.pelayanan_masyarakat.model.Pengguna;
import com.smartcommunity.pelayanan_masyarakat.repository.PenggunaRepository;

@RestController
@RequestMapping("/api/pengguna")
@CrossOrigin(origins = "*")
public class PenggunaController {

    private final PenggunaRepository penggunaRepository;

    public PenggunaController(PenggunaRepository penggunaRepository) {
        this.penggunaRepository = penggunaRepository;
    }

    @GetMapping
    public ResponseEntity<List<Pengguna>> getAllPengguna() {
        return ResponseEntity.ok(penggunaRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pengguna> getPenggunaById(@PathVariable Long id) {
        Pengguna pengguna = penggunaRepository.findById(id)
                .orElseThrow(() -> new DataTidakDitemukanException("Pengguna tidak ditemukan"));

        return ResponseEntity.ok(pengguna);
    }

    @PostMapping
    public ResponseEntity<Pengguna> tambahPengguna(@RequestBody Pengguna pengguna) {
        Pengguna savedPengguna = penggunaRepository.save(pengguna);
        return ResponseEntity.ok(savedPengguna);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> hapusPengguna(@PathVariable Long id) {
        Pengguna pengguna = penggunaRepository.findById(id)
                .orElseThrow(() -> new DataTidakDitemukanException("Pengguna tidak ditemukan"));

        penggunaRepository.delete(pengguna);
        return ResponseEntity.ok("Data pengguna berhasil dihapus");
    }
}