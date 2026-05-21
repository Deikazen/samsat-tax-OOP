package com.smartcommunity.pelayanan_masyarakat.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "layanan_pkb")
public class LayananPKB extends BaseEntity {

    @Column(nullable = false)
    private int tahunPajak;

    @Column(nullable = false)
    private double nominalTagihan;

    @Column(nullable = false)
    private String statusLayanan = "MENUNGGU"; // Default sesuai diagram

    // Relasi Many-to-One ke Kendaraan
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kendaraan_id", nullable = false)
    private Kendaraan kendaraan;

    // --- Encapsulation ---
    public int getTahunPajak() {
        return tahunPajak;
    }

    public void setTahunPajak(int tahunPajak) {
        if (tahunPajak < 2000) {
            throw new IllegalArgumentException("Tahun pajak tidak valid!");
        }
        this.tahunPajak = tahunPajak;
    }

    public double getNominalTagihan() {
        return nominalTagihan;
    }

    public void setNominalTagihan(double nominalTagihan) {
        if (nominalTagihan < 0) {
            throw new IllegalArgumentException("Nominal tagihan tidak boleh minus!");
        }
        this.nominalTagihan = nominalTagihan;
    }

    public String getStatusLayanan() {
        return statusLayanan;
    }

    public void setStatusLayanan(String statusLayanan) {
        this.statusLayanan = statusLayanan;
    }

    public Kendaraan getKendaraan() {
        return kendaraan;
    }

    public void setKendaraan(Kendaraan kendaraan) {
        this.kendaraan = kendaraan;
    }
}
