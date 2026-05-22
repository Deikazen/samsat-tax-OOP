package com.smartcommunity.pelayanan_masyarakat.service.impl;

import com.smartcommunity.pelayanan_masyarakat.repository.LayananRepository;
import com.smartcommunity.pelayanan_masyarakat.repository.PengaduanRepository;
import com.smartcommunity.pelayanan_masyarakat.repository.PenggunaRepository;
import com.smartcommunity.pelayanan_masyarakat.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final PengaduanRepository pengaduanRepo;
    private final LayananRepository layananRepo;
    private final PenggunaRepository penggunaRepo;

    public DashboardServiceImpl(PengaduanRepository pengaduanRepo,
            LayananRepository layananRepo,
            PenggunaRepository penggunaRepo) {
        this.pengaduanRepo = pengaduanRepo;
        this.layananRepo = layananRepo;
        this.penggunaRepo = penggunaRepo;
    }

    @Override
    public Map<String, Object> getAllSummary() {
        Map<String, Object> summary = new HashMap<>();

        // Menghitung total data dari masing-masing repository
        summary.put("totalPengaduan", pengaduanRepo.count());
        summary.put("totalLayananPKB", layananRepo.count());
        summary.put("totalWargaTerdaftar", penggunaRepo.count());

        return summary;
    }
}
