package com.smartcommunity.pelayanan_masyarakat.service.impl;

import com.smartcommunity.pelayanan_masyarakat.repository.LayananRepository;
import com.smartcommunity.pelayanan_masyarakat.repository.PengaduanRepository;
import com.smartcommunity.pelayanan_masyarakat.repository.AkunRepository; // 1. GANTI IMPORT INI
import com.smartcommunity.pelayanan_masyarakat.service.DashboardService;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final PengaduanRepository pengaduanRepo;
    private final LayananRepository layananRepo;
    private final AkunRepository akunRepo; // 2. GANTI DARI PenggunaRepository KE AkunRepository

    // 3. SESUAIKAN CONSTRUCTOR DICTION INJECTION
    public DashboardServiceImpl(PengaduanRepository pengaduanRepo,
            LayananRepository layananRepo,
            AkunRepository akunRepo) {
        this.pengaduanRepo = pengaduanRepo;
        this.layananRepo = layananRepo;
        this.akunRepo = akunRepo;
    }

    @Override
    public Map<String, Object> getAllSummary() {
        Map<String, Object> summary = new HashMap<>();

        summary.put("totalPengaduan", pengaduanRepo.count());
        summary.put("totalLayananPKB", layananRepo.count());

        // 4. GANTI PANGGILAN METHOD DI SINI
        summary.put("totalWargaTerdaftar", akunRepo.countPengguna());

        return summary;
    }
}
