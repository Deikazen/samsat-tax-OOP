package com.smartcommunity.pelayanan_masyarakat.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private String statusLayanan = "MENUNGGU";

    @Column
    private LocalDate jatuhTempo;

    @Column(nullable = false)
    private double denda = 0;

    @Column(length = 50)
    private String metodePembayaran;

    @Column
    private LocalDateTime tanggalBayar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kendaraan_id", nullable = false)
    private Kendaraan kendaraan;

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

    public LocalDate getJatuhTempo() {
        return jatuhTempo;
    }

    public void setJatuhTempo(LocalDate jatuhTempo) {
        this.jatuhTempo = jatuhTempo;
    }

    public double getDenda() {
        return denda;
    }

    public void setDenda(double denda) {
        if (denda < 0) {
            throw new IllegalArgumentException("Denda tidak boleh minus!");
        }
        this.denda = denda;
    }

    public String getMetodePembayaran() {
        return metodePembayaran;
    }

    public void setMetodePembayaran(String metodePembayaran) {
        this.metodePembayaran = metodePembayaran;
    }

    public LocalDateTime getTanggalBayar() {
        return tanggalBayar;
    }

    public void setTanggalBayar(LocalDateTime tanggalBayar) {
        this.tanggalBayar = tanggalBayar;
    }

    public Kendaraan getKendaraan() {
        return kendaraan;
    }

    public void setKendaraan(Kendaraan kendaraan) {
        this.kendaraan = kendaraan;
    }
}