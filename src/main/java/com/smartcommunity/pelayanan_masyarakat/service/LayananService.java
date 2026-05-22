package com.smartcommunity.pelayanan_masyarakat.service;

import java.util.List;

import com.smartcommunity.pelayanan_masyarakat.model.LayananPKB;

public interface LayananService {

    LayananPKB ajukanLayananPKB(LayananPKB layanan);

    List<LayananPKB> getAllLayanan();

    LayananPKB getLayananById(Long id);

    void updateStatusLayanan(Long id, String status);
}
