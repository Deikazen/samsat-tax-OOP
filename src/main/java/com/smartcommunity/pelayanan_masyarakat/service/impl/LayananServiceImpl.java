package com.smartcommunity.pelayanan_masyarakat.service.impl;

import com.smartcommunity.pelayanan_masyarakat.exception.DataTidakDitemukanException;
import com.smartcommunity.pelayanan_masyarakat.model.LayananPKB;
import com.smartcommunity.pelayanan_masyarakat.repository.LayananRepository;
import com.smartcommunity.pelayanan_masyarakat.service.LayananService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LayananServiceImpl implements LayananService {

    private final LayananRepository layananRepo;

    public LayananServiceImpl(LayananRepository layananRepo) {
        this.layananRepo = layananRepo;
    }

    @Override
    public LayananPKB ajukanLayananPKB(LayananPKB layanan) {
        return layananRepo.save(layanan);
    }

    @Override
    public List<LayananPKB> getAllLayanan() {
        return layananRepo.findAll();
    }

    @Override
    public LayananPKB getLayananById(Long id) {
        return layananRepo.findById(id)
                .orElseThrow(() -> new DataTidakDitemukanException("Layanan PKB dengan ID " + id + " tidak ditemukan!"));
    }

    @Override
    public void updateStatusLayanan(Long id, String status) {
        LayananPKB layanan = getLayananById(id);
        layanan.setStatusLayanan(status);
        layananRepo.save(layanan);
    }
}
