package com.smartcommunity.pelayanan_masyarakat.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.smartcommunity.pelayanan_masyarakat.exception.DataTidakDitemukanException;
import com.smartcommunity.pelayanan_masyarakat.model.LayananPKB;
import com.smartcommunity.pelayanan_masyarakat.repository.LayananRepository;
import com.smartcommunity.pelayanan_masyarakat.service.LayananService;

@Service
public class LayananServiceImpl implements LayananService {

    private final LayananRepository layananRepo;

    private static final double DENDA_PER_BULAN = 50000;

    public LayananServiceImpl(LayananRepository layananRepo) {
        this.layananRepo = layananRepo;
    }

    @Override
    public LayananPKB ajukanLayananPKB(LayananPKB layanan) {
        // Saat admin membuat tagihan, denda selalu 0 dulu.
        // Denda nanti dihitung otomatis saat telat/bayar.
        layanan.setDenda(0);

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

    private double hitungDendaOtomatis(LayananPKB layanan) {
        if (layanan.getJatuhTempo() == null) {
            return 0;
        }

        LocalDate hariIni = LocalDate.now();
        LocalDate jatuhTempo = layanan.getJatuhTempo();

        if (!hariIni.isAfter(jatuhTempo)) {
            return 0;
        }

        long hariTelat = ChronoUnit.DAYS.between(jatuhTempo, hariIni);

        // Dibulatkan ke atas.
        // Telat 1-30 hari = 1 bulan
        // Telat 31-60 hari = 2 bulan
        long bulanTelat = (long) Math.ceil(hariTelat / 30.0);

        return bulanTelat * DENDA_PER_BULAN;
    }

    @Override
    public LayananPKB bayarPajak(Long id, String metodePembayaran) {
        LayananPKB layanan = getLayananById(id);

        if ("LUNAS".equalsIgnoreCase(layanan.getStatusLayanan())) {
            throw new IllegalArgumentException("Tagihan pajak ini sudah lunas!");
        }

        double dendaOtomatis = hitungDendaOtomatis(layanan);

        layanan.setDenda(dendaOtomatis);
        layanan.setStatusLayanan("LUNAS");
        layanan.setMetodePembayaran(metodePembayaran);
        layanan.setTanggalBayar(LocalDateTime.now());

        return layananRepo.save(layanan);
    }
}