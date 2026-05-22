package com.smartcommunity.pelayanan_masyarakat.service;

import java.util.List;

import com.smartcommunity.pelayanan_masyarakat.model.Pengaduan;

public interface PengaduanService {

    Pengaduan ajukanPengaduan(Pengaduan pengadu);

    List<Pengaduan> getAllPengaduan();

    Pengaduan getPengaduanById(Long id);

    void updateStatusPengaduan(Long id, String status);
}
