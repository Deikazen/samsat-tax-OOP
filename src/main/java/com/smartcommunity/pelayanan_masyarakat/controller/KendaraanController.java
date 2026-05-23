// Nambahin kendaraan controlernyaa biar bisa nyambung samaa kendaraan di frontend
package com.smartcommunity.pelayanan_masyarakat.controller; 

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcommunity.pelayanan_masyarakat.exception.DataTidakDitemukanException;
import com.smartcommunity.pelayanan_masyarakat.model.Kendaraan;
import com.smartcommunity.pelayanan_masyarakat.repository.KendaraanRepository;

@RestController
@RequestMapping("/api/kendaraan")
@CrossOrigin(origins = "*")
public class KendaraanController {

    private final KendaraanRepository kendaraanRepository;

    public KendaraanController(KendaraanRepository kendaraanRepository) {
        this.kendaraanRepository = kendaraanRepository;
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
}