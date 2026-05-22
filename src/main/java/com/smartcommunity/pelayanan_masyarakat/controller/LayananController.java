package com.smartcommunity.pelayanan_masyarakat.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcommunity.pelayanan_masyarakat.model.LayananPKB;
import com.smartcommunity.pelayanan_masyarakat.service.LayananService;

@RestController
@RequestMapping("/api/layanan")
@CrossOrigin(origins = "*")
public class LayananController {

    private final LayananService layananService;

    public LayananController(LayananService layananService) {
        this.layananService = layananService;
    }

    @PostMapping
    public ResponseEntity<LayananPKB> buatPengajuanLayanan(@RequestBody LayananPKB layanan) {
        LayananPKB layananBaru = layananService.ajukanLayananPKB(layanan);
        return new ResponseEntity<>(layananBaru, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LayananPKB>> getAllLayanan() {
        List<LayananPKB> listLayanan = layananService.getAllLayanan();
        return ResponseEntity.ok(listLayanan);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LayananPKB> getLayananById(@PathVariable Long id) {
        LayananPKB layanan = layananService.getLayananById(id);
        return ResponseEntity.ok(layanan);
    }
}
