package com.smartcommunity.pelayanan_masyarakat.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smartcommunity.pelayanan_masyarakat.exception.DataTidakDitemukanException;
import com.smartcommunity.pelayanan_masyarakat.model.Kendaraan;
import com.smartcommunity.pelayanan_masyarakat.model.Pengguna;
import com.smartcommunity.pelayanan_masyarakat.repository.KendaraanRepository;
import com.smartcommunity.pelayanan_masyarakat.repository.PenggunaRepository;

@RestController
@RequestMapping("/api/kendaraan")
@CrossOrigin(origins = "*")
public class KendaraanController {

    private final KendaraanRepository kendaraanRepository;
    private final PenggunaRepository penggunaRepository;

    public KendaraanController(
            KendaraanRepository kendaraanRepository,
            PenggunaRepository penggunaRepository) {
        this.kendaraanRepository = kendaraanRepository;
        this.penggunaRepository = penggunaRepository;
    }

    @GetMapping
    public ResponseEntity<List<Kendaraan>> getAllKendaraan() {
        List<Kendaraan> listKendaraan = kendaraanRepository.findAll();
        return ResponseEntity.ok(listKendaraan);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Kendaraan> getKendaraanById(@PathVariable Long id) {
        Kendaraan kendaraan = kendaraanRepository.findById(id)
                .orElseThrow(() -> new DataTidakDitemukanException("Kendaraan tidak ditemukan"));

        return ResponseEntity.ok(kendaraan);
    }

    @GetMapping("/nik/{nik}")
    public ResponseEntity<List<Kendaraan>> getKendaraanByNik(@PathVariable String nik) {
        List<Kendaraan> listKendaraan = kendaraanRepository.findByPenggunaNik(nik);
        return ResponseEntity.ok(listKendaraan);
    }

    @PostMapping
    public ResponseEntity<Kendaraan> tambahKendaraan(@RequestBody Kendaraan kendaraan) {
        if (kendaraan.getPengguna() == null || kendaraan.getPengguna().getId() == null) {
            throw new IllegalArgumentException("Pemilik kendaraan wajib dipilih");
        }

        Pengguna pengguna = penggunaRepository.findById(kendaraan.getPengguna().getId())
                .orElseThrow(() -> new DataTidakDitemukanException("Pemilik kendaraan tidak ditemukan"));

        kendaraan.setPengguna(pengguna);

        Kendaraan kendaraanBaru = kendaraanRepository.save(kendaraan);

        return new ResponseEntity<>(kendaraanBaru, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Kendaraan> updateKendaraan(
            @PathVariable Long id,
            @RequestBody Kendaraan kendaraanRequest) {

        Kendaraan kendaraan = kendaraanRepository.findById(id)
                .orElseThrow(() -> new DataTidakDitemukanException("Kendaraan tidak ditemukan"));

        kendaraan.setPlatNomor(kendaraanRequest.getPlatNomor());
        kendaraan.setMerek(kendaraanRequest.getMerek());
        kendaraan.setTahun(kendaraanRequest.getTahun());

        if (kendaraanRequest.getPengguna() != null && kendaraanRequest.getPengguna().getId() != null) {
            Pengguna pengguna = penggunaRepository.findById(kendaraanRequest.getPengguna().getId())
                    .orElseThrow(() -> new DataTidakDitemukanException("Pemilik kendaraan tidak ditemukan"));

            kendaraan.setPengguna(pengguna);
        }

        Kendaraan kendaraanUpdate = kendaraanRepository.save(kendaraan);

        return ResponseEntity.ok(kendaraanUpdate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> hapusKendaraan(@PathVariable Long id) {
        Kendaraan kendaraan = kendaraanRepository.findById(id)
                .orElseThrow(() -> new DataTidakDitemukanException("Kendaraan tidak ditemukan"));

        kendaraanRepository.delete(kendaraan);

        return ResponseEntity.ok("Data kendaraan berhasil dihapus");
    }
}